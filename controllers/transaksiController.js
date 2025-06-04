const db = require("../db/db");
const response = require("../utils/response");

exports.getAllTransaksi = async (req, res) => {
  try {
    // Ambil semua transaksi
    const [transaksi] = await db.query("SELECT * FROM transaksi");

    // Untuk setiap transaksi, ambil total dari detail
    for (let t of transaksi) {
      const [details] = await db.query(
        "SELECT SUM(harga_menu * jumlah_menu) as total FROM transaksi_detail WHERE id_transaksi = ?",
        [t.id]
      );
      t.total_harga = details[0].total || 0;
    }

    response.success(res, transaksi, "Berhasil mengambil data transaksi");
  } catch (err) {
    response.error(res, "Gagal mengambil data transaksi", 500, err.message);
  }
};

exports.getTransaksiById = async (req, res) => {
  try {
    const [transaksi] = await db.query("SELECT * FROM transaksi WHERE id = ?", [
      req.params.id,
    ]);
    if (transaksi.length === 0)
      return response.error(res, "Transaksi tidak ditemukan", 404);

    // Ambil total dari detail
    const [details] = await db.query(
      "SELECT SUM(harga_menu * jumlah_menu) as total FROM transaksi_detail WHERE id_transaksi = ?",
      [req.params.id]
    );
    transaksi[0].total_harga = details[0].total || 0;

    response.success(res, transaksi[0], "Berhasil mengambil data transaksi");
  } catch (err) {
    response.error(res, "Gagal mengambil data transaksi", 500, err.message);
  }
};

exports.getTransaksiByNamaPembeli = async (req, res) => {
  try {
    // Konversi nama pembeli ke string dan bersihkan dari whitespace
    const nama_pembeli = String(req.params.nama_pembeli).trim();

    if (!nama_pembeli) {
      return response.error(res, "Nama pembeli tidak boleh kosong", 400);
    }

    // Gunakan LIKE untuk pencarian yang lebih fleksibel
    const [transaksi] = await db.query(
      "SELECT * FROM transaksi WHERE nama_pembeli LIKE ?",
      [`%${nama_pembeli}%`]
    );

    if (transaksi.length === 0) {
      return response.error(res, "Transaksi tidak ditemukan", 404);
    }

    // Untuk setiap transaksi, ambil total dari detail
    for (let t of transaksi) {
      const [details] = await db.query(
        "SELECT SUM(harga_menu * jumlah_menu) as total FROM transaksi_detail WHERE id_transaksi = ?",
        [t.id]
      );
      t.total_harga = details[0].total || 0;
    }

    response.success(res, transaksi, "Berhasil mengambil data transaksi");
  } catch (err) {
    response.error(res, "Gagal mengambil data transaksi", 500, err.message);
  }
};

exports.createTransaksi = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { nama_pembeli, nama_user, tanggal, items } = req.body;

    // Validasi input
    if (
      !nama_pembeli ||
      !nama_user ||
      !tanggal ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return response.error(res, "Data transaksi tidak lengkap", 400);
    }

    // Cari id_user berdasarkan nama
    const [users] = await connection.query(
      "SELECT id_user FROM user WHERE nama = ?",
      [nama_user]
    );
    if (users.length === 0) {
      throw new Error(`User dengan nama ${nama_user} tidak ditemukan`);
    }
    const id_user = users[0].id_user;

    // Cek ID transaksi terakhir
    const [lastTransaksi] = await connection.query(
      "SELECT MAX(id) as last_id FROM transaksi"
    );
    const nextId = (lastTransaksi[0].last_id || 0) + 1;

    // Insert transaksi dengan status default pending dan ID yang sudah ditentukan
    const [result] = await connection.query(
      "INSERT INTO transaksi (id, nama_pembeli, id_user, total_harga, tanggal, status) VALUES (?, ?, ?, 0, ?, 'pending')",
      [nextId, nama_pembeli, id_user, tanggal]
    );

    const id_transaksi = nextId;

    // Insert detail transaksi dan ambil harga dari menu
    for (const item of items) {
      // Cari menu berdasarkan nama
      const [menu] = await connection.query(
        "SELECT id, harga FROM menu WHERE nama = ?",
        [item.nama_menu]
      );
      if (menu.length === 0) {
        throw new Error(`Menu dengan nama ${item.nama_menu} tidak ditemukan`);
      }
      await connection.query(
        "INSERT INTO transaksi_detail (id_transaksi, id_menu, jumlah_menu, harga_menu) VALUES (?, ?, ?, ?)",
        [id_transaksi, menu[0].id, item.jumlah_menu, menu[0].harga]
      );
    }

    // Hitung total dari detail transaksi
    const [details] = await connection.query(
      "SELECT SUM(harga_menu * jumlah_menu) as total FROM transaksi_detail WHERE id_transaksi = ?",
      [id_transaksi]
    );
    const total_harga = details[0].total || 0;

    // Update total_harga di transaksi
    await connection.query(
      "UPDATE transaksi SET total_harga = ? WHERE id = ?",
      [total_harga, id_transaksi]
    );

    await connection.commit();

    response.success(
      res,
      { id_transaksi, total_harga },
      "Transaksi berhasil dibuat",
      201
    );
  } catch (err) {
    await connection.rollback();
    response.error(res, "Gagal membuat transaksi", 500, err.message);
  } finally {
    connection.release();
  }
};

exports.updateTransaksi = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const { nama_pembeli, nama_user, tanggal, status, items } = req.body;
    const id_transaksi = req.params.id;

    // Validasi input
    if (
      !nama_pembeli ||
      !nama_user ||
      !tanggal ||
      !status ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return response.error(res, "Data transaksi tidak lengkap", 400);
    }

    // Cari id_user berdasarkan nama
    const [users] = await connection.query(
      "SELECT id_user FROM user WHERE nama = ?",
      [nama_user]
    );
    if (users.length === 0) {
      throw new Error(`User dengan nama ${nama_user} tidak ditemukan`);
    }
    const id_user = users[0].id_user;

    // Update data transaksi (kecuali total_harga)
    await connection.query(
      "UPDATE transaksi SET nama_pembeli = ?, id_user = ?, tanggal = ?, status = ? WHERE id = ?",
      [nama_pembeli, id_user, tanggal, status, id_transaksi]
    );

    // Hapus detail transaksi lama
    await connection.query(
      "DELETE FROM transaksi_detail WHERE id_transaksi = ?",
      [id_transaksi]
    );

    // Insert detail transaksi baru
    for (const item of items) {
      // Cari menu berdasarkan nama
      const [menu] = await connection.query(
        "SELECT id, harga FROM menu WHERE nama = ?",
        [item.nama_menu]
      );
      if (menu.length === 0) {
        throw new Error(`Menu dengan nama ${item.nama_menu} tidak ditemukan`);
      }
      await connection.query(
        "INSERT INTO transaksi_detail (id_transaksi, id_menu, jumlah_menu, harga_menu) VALUES (?, ?, ?, ?)",
        [id_transaksi, menu[0].id, item.jumlah_menu, menu[0].harga]
      );
    }

    // Hitung total dari detail transaksi
    const [details] = await connection.query(
      "SELECT SUM(harga_menu * jumlah_menu) as total FROM transaksi_detail WHERE id_transaksi = ?",
      [id_transaksi]
    );
    const total_harga = details[0].total || 0;

    // Update total_harga di transaksi
    await connection.query(
      "UPDATE transaksi SET total_harga = ? WHERE id = ?",
      [total_harga, id_transaksi]
    );

    await connection.commit();

    response.success(res, { total_harga }, "Transaksi berhasil diupdate");
  } catch (err) {
    await connection.rollback();
    response.error(res, "Gagal mengupdate transaksi", 500, err.message);
  } finally {
    connection.release();
  }
};

exports.deleteTransaksi = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const id_transaksi = req.params.id;

    // Hapus detail transaksi terlebih dahulu
    await connection.query(
      "DELETE FROM transaksi_detail WHERE id_transaksi = ?",
      [id_transaksi]
    );

    // Hapus transaksi
    await connection.query("DELETE FROM transaksi WHERE id = ?", [
      id_transaksi,
    ]);

    await connection.commit();

    response.success(res, null, "Transaksi berhasil dihapus");
  } catch (err) {
    await connection.rollback();
    response.error(res, "Gagal menghapus transaksi", 500, err.message);
  } finally {
    connection.release();
  }
};

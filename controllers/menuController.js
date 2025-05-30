const db = require("../db/db");
const response = require("../utils/response");

exports.getAllMenu = async (req, res) => {
  try {
    const [menus] = await db.query("SELECT * FROM menu");
    response.success(res, menus, "Berhasil mengambil data menu");
  } catch (err) {
    response.error(res, "Gagal mengambil data menu", 500, err.message);
  }
};

exports.getMenuById = async (req, res) => {
  try {
    const [menu] = await db.query("SELECT * FROM menu WHERE id = ?", [
      req.params.id,
    ]);
    if (menu.length === 0)
      return response.error(res, "Menu tidak ditemukan", 404);
    response.success(res, menu[0], "Berhasil mengambil data menu");
  } catch (err) {
    response.error(res, "Gagal mengambil data menu", 500, err.message);
  }
};

exports.getMenuByName = async (req, res) => {
  try {
    // Konversi nama ke string dan bersihkan dari whitespace
    const nama = String(req.params.nama).trim();

    if (!nama) {
      return response.error(res, "Nama menu tidak boleh kosong", 400);
    }

    // Gunakan LIKE untuk pencarian yang lebih fleksibel
    const [menu] = await db.query("SELECT * FROM menu WHERE nama LIKE ?", [
      `%${nama}%`,
    ]);

    if (menu.length === 0) {
      return response.error(res, "Menu tidak ditemukan", 404);
    }

    response.success(res, menu, "Berhasil mengambil data menu");
  } catch (err) {
    response.error(res, "Gagal mengambil data menu", 500, err.message);
  }
};

exports.createMenu = async (req, res) => {
  try {
    let { nama, jenis, harga } = req.body;

    // Validasi input
    if (!nama || !jenis || !harga) {
      return response.error(res, "Semua field harus diisi", 400);
    }

    // Konversi nama ke string dan bersihkan dari whitespace
    nama = String(nama).trim();
    jenis = String(jenis).trim();

    // Validasi nama dan jenis tidak boleh kosong setelah di-trim
    if (!nama || !jenis) {
      return response.error(res, "Nama dan jenis menu tidak boleh kosong", 400);
    }

    // Konversi harga ke number
    harga = Number(harga);
    if (isNaN(harga) || harga <= 0) {
      return response.error(res, "Harga harus berupa angka positif", 400);
    }

    await db.query("INSERT INTO menu (nama, jenis, harga) VALUES (?, ?, ?)", [
      nama,
      jenis,
      harga,
    ]);
    response.success(res, null, "Menu berhasil dibuat", 201);
  } catch (err) {
    response.error(res, "Gagal membuat menu", 500, err.message);
  }
};

exports.updateMenu = async (req, res) => {
  try {
    let { nama, jenis, harga } = req.body;

    // Validasi input
    if (!nama || !jenis || !harga) {
      return response.error(res, "Semua field harus diisi", 400);
    }

    // Konversi nama ke string dan bersihkan dari whitespace
    nama = String(nama).trim();
    jenis = String(jenis).trim();

    // Validasi nama dan jenis tidak boleh kosong setelah di-trim
    if (!nama || !jenis) {
      return response.error(res, "Nama dan jenis menu tidak boleh kosong", 400);
    }

    // Konversi harga ke number
    harga = Number(harga);
    if (isNaN(harga) || harga <= 0) {
      return response.error(res, "Harga harus berupa angka positif", 400);
    }

    await db.query(
      "UPDATE menu SET nama = ?, jenis = ?, harga = ? WHERE id = ?",
      [nama, jenis, harga, req.params.id]
    );
    response.success(res, null, "Menu berhasil diupdate");
  } catch (err) {
    response.error(res, "Gagal mengupdate menu", 500, err.message);
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    await db.query("DELETE FROM menu WHERE id = ?", [req.params.id]);
    response.success(res, null, "Menu berhasil dihapus");
  } catch (err) {
    response.error(res, "Gagal menghapus menu", 500, err.message);
  }
};

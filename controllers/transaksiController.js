const db = require("../db/db");
const response = require("../utils/response");

exports.getAllTransaksi = async (req, res) => {
  try {
    const [transaksi] = await db.query("SELECT * FROM transaksi");
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
    response.success(res, transaksi[0], "Berhasil mengambil data transaksi");
  } catch (err) {
    response.error(res, "Gagal mengambil data transaksi", 500, err.message);
  }
};

exports.getTransaksiByName = async (req, res) => {
  try {
    const [transaksi] = await db.query("SELECT * FROM transaksi WHERE name = ?", [
      req.params.name,
    ]);
    if (transaksi.length === 0)
      return response.error(res, "Transaksi tidak ditemukan", 404);
    response.success(res, transaksi[0], "Berhasil mengambil data transaksi");
  } catch (err) {
    response.error(res, "Gagal mengambil data transaksi", 500, err.message);
  }
};

exports.createTransaksi = async (req, res) => {
  try {
    const { nama_pembeli, id_user, total_harga, tanggal, status } = req.body;
    await db.query(
      "INSERT INTO transaksi (nama_pembeli, id_user, total_harga, tanggal, status) VALUES (?, ?, ?, ?, ?)",
      [nama_pembeli, id_user, total_harga, tanggal, status]
    );
    response.success(res, null, "Transaksi berhasil dibuat", 201);
  } catch (err) {
    response.error(res, "Gagal membuat transaksi", 500, err.message);
  }
};

exports.updateTransaksi = async (req, res) => {
  try {
    const { nama_pembeli, id_user, total_harga, tanggal, status } = req.body;
    await db.query(
      "UPDATE transaksi SET nama_pembeli = ?, id_user = ?, total_harga = ?, tanggal = ?, status = ? WHERE id = ?",
      [nama_pembeli, id_user, total_harga, tanggal, status, req.params.id]
    );
    response.success(res, null, "Transaksi berhasil diupdate");
  } catch (err) {
    response.error(res, "Gagal mengupdate transaksi", 500, err.message);
  }
};

exports.deleteTransaksi = async (req, res) => {
  try {
    await db.query("DELETE FROM transaksi WHERE id = ?", [req.params.id]);
    response.success(res, null, "Transaksi berhasil dihapus");
  } catch (err) {
    response.error(res, "Gagal menghapus transaksi", 500, err.message);
  }
};

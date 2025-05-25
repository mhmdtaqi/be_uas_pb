const db = require("../db/db");
const response = require("../utils/response");

exports.getAllTransaksiDetail = async (req, res) => {
  try {
    const [details] = await db.query("SELECT * FROM transaksi_detail");
    response.success(res, details, "Berhasil mengambil data detail transaksi");
  } catch (err) {
    response.error(
      res,
      "Gagal mengambil data detail transaksi",
      500,
      err.message
    );
  }
};

exports.getTransaksiDetailById = async (req, res) => {
  try {
    const [detail] = await db.query(
      "SELECT * FROM transaksi_detail WHERE id_detail = ?",
      [req.params.id]
    );
    if (detail.length === 0)
      return response.error(res, "Detail transaksi tidak ditemukan", 404);
    response.success(
      res,
      detail[0],
      "Berhasil mengambil data detail transaksi"
    );
  } catch (err) {
    response.error(
      res,
      "Gagal mengambil data detail transaksi",
      500,
      err.message
    );
  }
};

exports.createTransaksiDetail = async (req, res) => {
  try {
    const { id_transaksi, id_menu, jumlah_menu, harga_menu } = req.body;
    await db.query(
      "INSERT INTO transaksi_detail (id_transaksi, id_menu, jumlah_menu, harga_menu) VALUES (?, ?, ?, ?)",
      [id_transaksi, id_menu, jumlah_menu, harga_menu]
    );
    response.success(res, null, "Detail transaksi berhasil dibuat", 201);
  } catch (err) {
    response.error(res, "Gagal membuat detail transaksi", 500, err.message);
  }
};

exports.updateTransaksiDetail = async (req, res) => {
  try {
    const { id_transaksi, id_menu, jumlah_menu, harga_menu } = req.body;
    await db.query(
      "UPDATE transaksi_detail SET id_transaksi = ?, id_menu = ?, jumlah_menu = ?, harga_menu = ? WHERE id_detail = ?",
      [id_transaksi, id_menu, jumlah_menu, harga_menu, req.params.id]
    );
    response.success(res, null, "Detail transaksi berhasil diupdate");
  } catch (err) {
    response.error(res, "Gagal mengupdate detail transaksi", 500, err.message);
  }
};

exports.deleteTransaksiDetail = async (req, res) => {
  try {
    await db.query("DELETE FROM transaksi_detail WHERE id_detail = ?", [
      req.params.id,
    ]);
    response.success(res, null, "Detail transaksi berhasil dihapus");
  } catch (err) {
    response.error(res, "Gagal menghapus detail transaksi", 500, err.message);
  }
};

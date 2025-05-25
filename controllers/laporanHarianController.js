const db = require("../db/db");
const response = require("../utils/response");

exports.getAllLaporanHarian = async (req, res) => {
  try {
    const [laporan] = await db.query("SELECT * FROM laporan_harian");
    response.success(res, laporan, "Berhasil mengambil data laporan harian");
  } catch (err) {
    response.error(
      res,
      "Gagal mengambil data laporan harian",
      500,
      err.message
    );
  }
};

exports.getLaporanHarianByTanggal = async (req, res) => {
  try {
    const [laporan] = await db.query(
      "SELECT * FROM laporan_harian WHERE tanggal = ?",
      [req.params.tanggal]
    );
    if (laporan.length === 0)
      return response.error(res, "Laporan harian tidak ditemukan", 404);
    response.success(res, laporan[0], "Berhasil mengambil data laporan harian");
  } catch (err) {
    response.error(
      res,
      "Gagal mengambil data laporan harian",
      500,
      err.message
    );
  }
};

exports.createLaporanHarian = async (req, res) => {
  try {
    const {
      tanggal,
      total_transaksi,
      total_pendapatan,
      transaksi_selesai,
      transaksi_dibatalkan,
    } = req.body;
    await db.query(
      "INSERT INTO laporan_harian (tanggal, total_transaksi, total_pendapatan, transaksi_selesai, transaksi_dibatalkan) VALUES (?, ?, ?, ?, ?)",
      [
        tanggal,
        total_transaksi,
        total_pendapatan,
        transaksi_selesai,
        transaksi_dibatalkan,
      ]
    );
    response.success(res, null, "Laporan harian berhasil dibuat", 201);
  } catch (err) {
    response.error(res, "Gagal membuat laporan harian", 500, err.message);
  }
};

exports.updateLaporanHarian = async (req, res) => {
  try {
    const {
      total_transaksi,
      total_pendapatan,
      transaksi_selesai,
      transaksi_dibatalkan,
    } = req.body;
    await db.query(
      "UPDATE laporan_harian SET total_transaksi = ?, total_pendapatan = ?, transaksi_selesai = ?, transaksi_dibatalkan = ? WHERE tanggal = ?",
      [
        total_transaksi,
        total_pendapatan,
        transaksi_selesai,
        transaksi_dibatalkan,
        req.params.tanggal,
      ]
    );
    response.success(res, null, "Laporan harian berhasil diupdate");
  } catch (err) {
    response.error(res, "Gagal mengupdate laporan harian", 500, err.message);
  }
};

exports.deleteLaporanHarian = async (req, res) => {
  try {
    await db.query("DELETE FROM laporan_harian WHERE tanggal = ?", [
      req.params.tanggal,
    ]);
    response.success(res, null, "Laporan harian berhasil dihapus");
  } catch (err) {
    response.error(res, "Gagal menghapus laporan harian", 500, err.message);
  }
};

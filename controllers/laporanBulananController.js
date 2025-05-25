const db = require("../db/db");
const response = require("../utils/response");

exports.getAllLaporanBulanan = async (req, res) => {
  try {
    const [laporan] = await db.query("SELECT * FROM laporan_bulanan");
    response.success(res, laporan, "Berhasil mengambil data laporan bulanan");
  } catch (err) {
    response.error(
      res,
      "Gagal mengambil data laporan bulanan",
      500,
      err.message
    );
  }
};

exports.getLaporanBulananByBulan = async (req, res) => {
  try {
    const [laporan] = await db.query(
      "SELECT * FROM laporan_bulanan WHERE bulan = ?",
      [req.params.bulan]
    );
    if (laporan.length === 0)
      return response.error(res, "Laporan bulanan tidak ditemukan", 404);
    response.success(
      res,
      laporan[0],
      "Berhasil mengambil data laporan bulanan"
    );
  } catch (err) {
    response.error(
      res,
      "Gagal mengambil data laporan bulanan",
      500,
      err.message
    );
  }
};

exports.createLaporanBulanan = async (req, res) => {
  try {
    const {
      bulan,
      total_transaksi,
      total_pendapatan,
      transaksi_selesai,
      transaksi_dibatalkan,
    } = req.body;
    await db.query(
      "INSERT INTO laporan_bulanan (bulan, total_transaksi, total_pendapatan, transaksi_selesai, transaksi_dibatalkan) VALUES (?, ?, ?, ?, ?)",
      [
        bulan,
        total_transaksi,
        total_pendapatan,
        transaksi_selesai,
        transaksi_dibatalkan,
      ]
    );
    response.success(res, null, "Laporan bulanan berhasil dibuat", 201);
  } catch (err) {
    response.error(res, "Gagal membuat laporan bulanan", 500, err.message);
  }
};

exports.updateLaporanBulanan = async (req, res) => {
  try {
    const {
      total_transaksi,
      total_pendapatan,
      transaksi_selesai,
      transaksi_dibatalkan,
    } = req.body;
    await db.query(
      "UPDATE laporan_bulanan SET total_transaksi = ?, total_pendapatan = ?, transaksi_selesai = ?, transaksi_dibatalkan = ? WHERE bulan = ?",
      [
        total_transaksi,
        total_pendapatan,
        transaksi_selesai,
        transaksi_dibatalkan,
        req.params.bulan,
      ]
    );
    response.success(res, null, "Laporan bulanan berhasil diupdate");
  } catch (err) {
    response.error(res, "Gagal mengupdate laporan bulanan", 500, err.message);
  }
};

exports.deleteLaporanBulanan = async (req, res) => {
  try {
    await db.query("DELETE FROM laporan_bulanan WHERE bulan = ?", [
      req.params.bulan,
    ]);
    response.success(res, null, "Laporan bulanan berhasil dihapus");
  } catch (err) {
    response.error(res, "Gagal menghapus laporan bulanan", 500, err.message);
  }
};

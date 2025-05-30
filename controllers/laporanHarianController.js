const db = require("../db/db");
const response = require("../utils/response");

// Fungsi untuk mengubah format tanggal
const formatTanggal = (tanggal) => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const date = new Date(tanggal);
  const namaHari = hari[date.getDay()];
  const tanggalFormatted = date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${namaHari}, ${tanggalFormatted}`;
};

exports.getAllLaporanHarian = async (req, res) => {
  try {
    const [laporan] = await db.query("SELECT * FROM laporan_harian");

    // Format tanggal untuk setiap laporan
    const laporanFormatted = laporan.map((item) => ({
      ...item,
      tanggal: formatTanggal(item.tanggal),
    }));

    response.success(
      res,
      laporanFormatted,
      "Berhasil mengambil data laporan harian"
    );
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
    // Log untuk debugging
    console.log("Tanggal yang dicari:", req.params.tanggal);

    const [laporan] = await db.query(
      "SELECT * FROM laporan_harian WHERE DATE_FORMAT(tanggal, '%Y-%m-%d') = ?",
      [req.params.tanggal]
    );

    console.log("Hasil query:", laporan);

    if (laporan.length === 0)
      return response.error(res, "Laporan harian tidak ditemukan", 404);

    // Format tanggal untuk laporan yang ditemukan
    const laporanFormatted = {
      ...laporan[0],
      tanggal: formatTanggal(laporan[0].tanggal),
    };

    response.success(
      res,
      laporanFormatted,
      "Berhasil mengambil data laporan harian"
    );
  } catch (err) {
    console.error("Error:", err);
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

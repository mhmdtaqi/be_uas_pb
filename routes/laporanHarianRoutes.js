const express = require("express");
const router = express.Router();
const laporanHarianController = require("../controllers/laporanHarianController");

router.get("/", laporanHarianController.getAllLaporanHarian);
router.get("/:tanggal", laporanHarianController.getLaporanHarianByTanggal);
router.post("/add-laporan-harian", laporanHarianController.createLaporanHarian);
router.put(
  "/update-laporan-harian/:tanggal",
  laporanHarianController.updateLaporanHarian
);
router.delete(
  "/delete-laporan-harian/:tanggal",
  laporanHarianController.deleteLaporanHarian
);

module.exports = router;

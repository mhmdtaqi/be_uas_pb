const express = require("express");
const router = express.Router();
const laporanBulananController = require("../controllers/laporanBulananController");

router.get("/", laporanBulananController.getAllLaporanBulanan);
router.get("/:bulan", laporanBulananController.getLaporanBulananByBulan);
router.post(
  "/add-laporan-bulanan",
  laporanBulananController.createLaporanBulanan
);
router.put(
  "/update-laporan-bulanan/:bulan",
  laporanBulananController.updateLaporanBulanan
);
router.delete(
  "/delete-laporan-bulanan/:bulan",
  laporanBulananController.deleteLaporanBulanan
);

module.exports = router;

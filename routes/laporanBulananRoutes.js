const express = require("express");
const router = express.Router();
const laporanBulananController = require("../controllers/laporanBulananController");
const authMiddleware = require("../utils/authMiddleware");
const { ownerOnly } = require("../utils/roleMiddleware");

// Protected routes - hanya owner yang bisa akses
router.get(
  "/",
  authMiddleware,
  ownerOnly,
  laporanBulananController.getAllLaporanBulanan
);
router.get(
  "/:bulan",
  authMiddleware,
  ownerOnly,
  laporanBulananController.getLaporanBulananByBulan
);
router.post(
  "/",
  authMiddleware,
  ownerOnly,
  laporanBulananController.createLaporanBulanan
);
router.put(
  "/:bulan",
  authMiddleware,
  ownerOnly,
  laporanBulananController.updateLaporanBulanan
);
router.delete(
  "/:bulan",
  authMiddleware,
  ownerOnly,
  laporanBulananController.deleteLaporanBulanan
);

module.exports = router;

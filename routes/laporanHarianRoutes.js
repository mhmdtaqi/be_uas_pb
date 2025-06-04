const express = require("express");
const router = express.Router();
const laporanHarianController = require("../controllers/laporanHarianController");
const authMiddleware = require("../utils/authMiddleware");
const { ownerOnly } = require("../utils/roleMiddleware");


router.get("/",authMiddleware,ownerOnly,laporanHarianController.getAllLaporanHarian);
router.get("/:tanggal",authMiddleware,ownerOnly,laporanHarianController.getLaporanHarianByTanggal);
router.post("/",authMiddleware,ownerOnly,laporanHarianController.createLaporanHarian);
router.put("/:tanggal",authMiddleware,ownerOnly,laporanHarianController.updateLaporanHarian);
router.delete("/:tanggal",authMiddleware,ownerOnly,laporanHarianController.deleteLaporanHarian);

module.exports = router;

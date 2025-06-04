const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");
const authMiddleware = require("../utils/authMiddleware");
const { ownerAndKasir } = require("../utils/roleMiddleware");


router.get("/",authMiddleware,ownerAndKasir,transaksiController.getAllTransaksi);
router.get("/:id",authMiddleware,ownerAndKasir,transaksiController.getTransaksiById);
router.get("/n/:nama_pembeli",authMiddleware,ownerAndKasir,transaksiController.getTransaksiByNamaPembeli);
router.post("/",authMiddleware,ownerAndKasir,transaksiController.createTransaksi);
router.put("/:id",authMiddleware,ownerAndKasir,transaksiController.updateTransaksi);
router.delete("/:id",authMiddleware,ownerAndKasir,transaksiController.deleteTransaksi);

module.exports = router;

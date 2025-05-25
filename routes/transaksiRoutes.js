const express = require("express");
const router = express.Router();
const transaksiController = require("../controllers/transaksiController");

router.get("/", transaksiController.getAllTransaksi);
router.get("/:id", transaksiController.getTransaksiById);
router.post("/add-transaksi", transaksiController.createTransaksi);
router.put("/update-transaksi/:id", transaksiController.updateTransaksi);
router.delete("/delete-transaksi/:id", transaksiController.deleteTransaksi);

module.exports = router;

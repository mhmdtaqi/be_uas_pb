const express = require("express");
const router = express.Router();
const transaksiDetailController = require("../controllers/transaksiDetailController");


router.get("/", transaksiDetailController.getAllTransaksiDetail);
router.get("/:id", transaksiDetailController.getTransaksiDetailById);
router.post("/add-transaksi-detail",transaksiDetailController.createTransaksiDetail);
router.put("/update-transaksi-detail/:id",transaksiDetailController.updateTransaksiDetail);
router.delete("/delete-transaksi-detail/:id",transaksiDetailController.deleteTransaksiDetail);

module.exports = router;

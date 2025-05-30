const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const authMiddleware = require("../utils/authMiddleware");
const { ownerOnly } = require("../utils/roleMiddleware");

// Protected routes - hanya owner yang bisa akses
router.get("/", authMiddleware, ownerOnly, menuController.getAllMenu);

// Route untuk mencari menu berdasarkan nama
router.get(
  "/n/:nama",
  authMiddleware,
  ownerOnly,
  menuController.getMenuByName
);

// Route untuk operasi CRUD dengan ID
router.get("/:id", authMiddleware, ownerOnly, menuController.getMenuById);
router.post("/", authMiddleware, ownerOnly, menuController.createMenu);
router.put("/:id", authMiddleware, ownerOnly, menuController.updateMenu);
router.delete("/:id", authMiddleware, ownerOnly, menuController.deleteMenu);

module.exports = router;

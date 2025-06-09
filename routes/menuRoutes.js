const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const authMiddleware = require("../utils/authMiddleware");
const { ownerOnly, ownerAndKasir } = require("../utils/roleMiddleware");

// Route yang bisa diakses kasir
router.get("/", authMiddleware, ownerAndKasir, menuController.getAllMenu);
router.get(
  "/n/:nama",
  authMiddleware,
  ownerAndKasir,
  menuController.getMenuByName
);
router.get("/:id", authMiddleware, ownerAndKasir, menuController.getMenuById);

// Route yang hanya bisa diakses owner
router.post("/", authMiddleware, ownerOnly, menuController.createMenu);
router.put("/:id", authMiddleware, ownerOnly, menuController.updateMenu);
router.delete("/:id", authMiddleware, ownerOnly, menuController.deleteMenu);

module.exports = router;

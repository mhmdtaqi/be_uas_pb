const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");
const authMiddleware = require("../utils/authMiddleware");
const { ownerOnly } = require("../utils/roleMiddleware");


router.get("/", authMiddleware, ownerOnly, menuController.getAllMenu);
router.get("/n/:nama",authMiddleware,ownerOnly,menuController.getMenuByName);
router.get("/:id", authMiddleware, ownerOnly, menuController.getMenuById);
router.post("/", authMiddleware, ownerOnly, menuController.createMenu);
router.put("/:id", authMiddleware, ownerOnly, menuController.updateMenu);
router.delete("/:id", authMiddleware, ownerOnly, menuController.deleteMenu);

module.exports = router;

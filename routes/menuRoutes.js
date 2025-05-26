const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

router.get("/", menuController.getAllMenus);
router.get("/:id", menuController.getMenuById);
router.get("/:name", menuController.getMenuByName);
router.post("/add-menu", menuController.createMenu);
router.put("/update-menu/:id", menuController.updateMenu);
router.delete("/delete-menu/:id", menuController.deleteMenu);

module.exports = router;

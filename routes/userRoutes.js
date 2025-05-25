const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Route GET semua user
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.post("/add-user", userController.createUser);
router.put("/update-user/:id", userController.updateUser);
router.delete("/delete-user/:id", userController.deleteUser);

module.exports = router;

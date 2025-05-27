const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../utils/authMiddleware");

// Public routes
router.post("/login", userController.login);
router.post("/register", userController.Register);

// Protected routes
router.get("/", authMiddleware, userController.getAllUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/update-user/:id", authMiddleware, userController.updateUser);
router.delete("/delete-user/:id", authMiddleware, userController.deleteUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../utils/authMiddleware");
const { ownerOnly } = require("../utils/roleMiddleware");

// Public routes
router.post("/login", userController.login);

// Protected routes - hanya owner yang bisa akses
router.post("/register", authMiddleware, ownerOnly, userController.Register);
router.get("/", authMiddleware, ownerOnly, userController.getAllUsers);
router.get("/current", authMiddleware, userController.getCurrentUser);
router.get("/:id", authMiddleware, ownerOnly, userController.getUserById);
router.put(
  "/update-user/:id",
  authMiddleware,
  ownerOnly,
  userController.updateUser
);
router.delete(
  "/delete-user/:id",
  authMiddleware,
  ownerOnly,
  userController.deleteUser
);

module.exports = router;

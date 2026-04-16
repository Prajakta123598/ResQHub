// backend/routes/userRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser, // ✅ Import delete controller
} = require("../controllers/userController");

const { protect, admin } = require("../middleware/authMiddleware"); // ✅ Admin middleware

const router = express.Router();

// @desc Register a new user
// @route POST /api/users/register
// @access Public
router.post("/register", registerUser);

// @desc Login user
// @route POST /api/users/login
// @access Public
router.post("/login", loginUser);

// @desc Get logged-in user's profile
// @route GET /api/users/profile
// @access Private
router.get("/profile", protect, getUserProfile);

// @desc Get all users
// @route GET /api/users
// @access Private/Admin
router.get("/", protect, admin, getUsers); // ✅ Only admin can see all users

// @desc Delete user by ID
// @route DELETE /api/users/:id
// @access Private/Admin
router.delete("/:id", protect, admin, deleteUser); // ✅ Admin-only delete route

module.exports = router;

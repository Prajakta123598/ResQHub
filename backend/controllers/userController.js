const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// ✅ Utility: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// ✅ @desc    Register new user
// @route     POST /api/users/register
// @access    Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists with this email");
  }

  // Create user, password hashing handled by model
  const user = await User.create({
    name,
    email,
    password,
    role: role || "user", // default role = user
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// ✅ @desc    Login user
// @route     POST /api/users/login
// @access    Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// ✅ @desc    Get user profile
// @route     GET /api/users/profile
// @access    Private
const getUserProfile = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    _id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
});

// ✅ @desc    Get all users (Admin only)
// @route     GET /api/users
// @access    Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password"); // hide passwords
  res.json(users);
});

// ✅ @desc    Delete user by ID (Admin only)
// @route     DELETE /api/users/:id
// @access    Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  await user.remove();
  res.json({ message: "User deleted successfully" });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser,
};

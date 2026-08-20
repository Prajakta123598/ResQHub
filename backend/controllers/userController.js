const asyncHandler = require("express-async-handler");

const User = require("../models/User");

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  console.log("REGISTER REQUEST:", req.body);

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide all fields");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "user",
  });

  console.log("USER CREATED:", user.email);

  res.status(201).json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  console.log("LOGIN REQUEST:", { email });

  const user = await User.findOne({ email });

  if (!user) {
    console.log("User not found");

    res.status(401);
    throw new Error("Invalid email or password");
  }

  console.log("User Found:", user.email);

  const isMatch = await user.matchPassword(password);

  console.log("Password Match:", isMatch);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

const getUserProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "User deleted",
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser,
};
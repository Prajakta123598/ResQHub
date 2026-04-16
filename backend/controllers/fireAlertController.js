const asyncHandler = require("express-async-handler");
const FireAlert = require("../models/FireAlert");

// Create alert
const createAlert = asyncHandler(async (req, res) => {
  const { location, message, severity } = req.body;

  if (!location || !message) {
    res.status(400);
    throw new Error(
      "Please provide location and message"
    );
  }

  const alert = await FireAlert.create({
    user: req.user._id,
    location,
    message,
    severity,
  });

  res.status(201).json(alert);
});

// Get logged-in user's alerts
const getMyAlerts = asyncHandler(async (req, res) => {
  const alerts = await FireAlert.find({
    user: req.user._id,
  }).sort({
    createdAt: -1,
  });

  res.json(alerts);
});

// Get all alerts (admin)
const getAllAlerts = asyncHandler(async (req, res) => {
  const alerts = await FireAlert.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json(alerts);
});

// Resolve alert
const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await FireAlert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error("Alert not found");
  }

  alert.status = "resolved";

  const updated = await alert.save();

  res.json(updated);
});

module.exports = {
  createAlert,
  getMyAlerts,
  getAllAlerts,
  resolveAlert,
};
const asyncHandler = require("express-async-handler");
const FireAlert = require("../models/FireAlert");

// ==================================================
// CREATE FIRE ALERT
// USER
// ==================================================

const createAlert = asyncHandler(async (req, res) => {
  const { location, message, severity } = req.body;

  if (!location || !message) {
    res.status(400);
    throw new Error("Location and message are required");
  }

  const alert = await FireAlert.create({
    user: req.user._id,
    location,
    message,
    severity: severity || "medium",
    status: "active",
  });

  res.status(201).json(alert);
});

// ==================================================
// GET LOGGED-IN USER'S ALERTS
// ==================================================

const getMyAlerts = asyncHandler(async (req, res) => {
  const alerts = await FireAlert.find({
    user: req.user._id,
  })
    .sort({ createdAt: -1 })
    .populate("user", "name email");

  res.json(alerts);
});

// ==================================================
// ADMIN - GET ALL FIRE ALERTS
// ==================================================

const getAllAlerts = asyncHandler(async (req, res) => {
  const alerts = await FireAlert.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });

  res.json(alerts);
});

// ==================================================
// ADMIN - CHANGE ALERT STATUS
// ==================================================

const resolveAlert = asyncHandler(async (req, res) => {
  const alert = await FireAlert.findById(req.params.id);

  if (!alert) {
    res.status(404);
    throw new Error("Fire alert not found");
  }

  const { status } = req.body;

  if (!["active", "resolved"].includes(status)) {
    res.status(400);
    throw new Error("Status must be active or resolved");
  }

  alert.status = status;

  const updatedAlert = await alert.save();

  const populatedAlert = await updatedAlert.populate(
    "user",
    "name email role"
  );

  res.json(populatedAlert);
});

// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  createAlert,
  getMyAlerts,
  getAllAlerts,
  resolveAlert,
};
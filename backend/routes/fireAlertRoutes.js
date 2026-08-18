const express = require("express");

const router = express.Router();

const {
  createAlert,
  getMyAlerts,
  getAllAlerts,
  resolveAlert,
} = require("../controllers/fireAlertController");

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");

// ==================================================
// USER ROUTES
// ==================================================

// Create fire alert
router.post("/", protect, createAlert);

// Get logged-in user's alerts
router.get("/my", protect, getMyAlerts);

// ==================================================
// ADMIN ROUTES
// ==================================================

// Get all fire alerts
router.get("/", protect, admin, getAllAlerts);

// Resolve fire alert
router.put("/:id/resolve", protect, admin, resolveAlert);

module.exports = router;
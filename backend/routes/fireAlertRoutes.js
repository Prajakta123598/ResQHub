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

// User routes
router.post("/", protect, createAlert);
router.get("/my", protect, getMyAlerts);

// Admin routes
router.get("/", protect, admin, getAllAlerts);
router.put("/:id/resolve", protect, admin, resolveAlert);

module.exports = router;
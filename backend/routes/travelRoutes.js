const express = require("express");
const router = express.Router();

const {
  createTravel,
  getMyTravels,
  getAllTravels,
  getTravelById,
  updateTravel,
  deleteTravel,
  changeStatus,
} = require("../controllers/travelController");

const { protect, admin } = require("../middleware/authMiddleware"); // ✅ use 'admin' as defined

// Create travel (logged-in user)
router.post("/", protect, createTravel);

// Get logged-in user's travels
router.get("/my", protect, getMyTravels);

// Get all travels (admin only)
router.get("/", protect, admin, getAllTravels);

// Get single travel by ID
router.get("/:id", protect, getTravelById);

// Update travel (owner or admin)
router.put("/:id", protect, updateTravel);

// Delete travel (owner or admin)
router.delete("/:id", protect, deleteTravel);

// Admin change status
router.put("/:id/status", protect, admin, changeStatus);

module.exports = router;

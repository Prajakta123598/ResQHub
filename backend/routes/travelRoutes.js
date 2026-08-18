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

const {
  protect,
  admin,
} = require("../middleware/authMiddleware");


// Create travel
router.post("/", protect, createTravel);


// Get logged-in user's travels
router.get("/my", protect, getMyTravels);


// Admin - get all travels
router.get("/", protect, admin, getAllTravels);


// Admin - approve/reject travel
router.put("/:id/status", protect, admin, changeStatus);


// Get single travel
router.get("/:id", protect, getTravelById);


// Update travel
router.put("/:id", protect, updateTravel);


// Delete travel
router.delete("/:id", protect, deleteTravel);


module.exports = router;
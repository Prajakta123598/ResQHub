const asyncHandler = require("express-async-handler");
const TravelRequest = require("../models/TravelRequest");

// ✅ Create a travel request (logged in user)
const createTravel = asyncHandler(async (req, res) => {
  const { title, purpose, destination, fromDate, toDate } = req.body;

  if (!title || !purpose || !destination || !fromDate || !toDate) {
    res.status(400);
    throw new Error(
      "Please provide title, purpose, destination, fromDate and toDate"
    );
  }

  const travel = await TravelRequest.create({
    user: req.user._id,
    title,
    purpose,
    destination,
    fromDate,
    toDate,
  });

  res.status(201).json(travel);
});

// ✅ Get logged-in user's travel requests
const getMyTravels = asyncHandler(async (req, res) => {
  const travels = await TravelRequest.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(travels);
});

// ✅ Admin: get all travel requests
const getAllTravels = asyncHandler(async (req, res) => {
  const travels = await TravelRequest.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 });
  res.json(travels);
});

// ✅ Get single travel (owner or admin)
const getTravelById = asyncHandler(async (req, res) => {
  const travel = await TravelRequest.findById(req.params.id).populate(
    "user",
    "name email role"
  );
  if (!travel) {
    res.status(404);
    throw new Error("Travel request not found");
  }

  // owner or admin can view
  if (
    travel.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to view this travel request");
  }

  res.json(travel);
});

// ✅ Update travel (owner or admin)
const updateTravel = asyncHandler(async (req, res) => {
  const travel = await TravelRequest.findById(req.params.id);
  if (!travel) {
    res.status(404);
    throw new Error("Travel request not found");
  }

  if (
    travel.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this travel request");
  }

  // don't allow user to change status directly (only admin)
  const { title, purpose, destination, fromDate, toDate } = req.body;
  if (title) travel.title = title;
  if (purpose) travel.purpose = purpose;
  if (destination) travel.destination = destination;
  if (fromDate) travel.fromDate = fromDate;
  if (toDate) travel.toDate = toDate;

  const updated = await travel.save();
  res.json(updated);
});

// ✅ Delete travel (owner or admin)
const deleteTravel = asyncHandler(async (req, res) => {
  const travel = await TravelRequest.findById(req.params.id);
  if (!travel) {
    res.status(404);
    throw new Error("Travel request not found");
  }

  if (
    travel.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this travel request");
  }

  // ❌ old: await travel.remove();
  // ✅ new:
  await TravelRequest.deleteOne({ _id: travel._id });

  res.json({ message: "Travel request removed successfully 🚮" });
});

// ✅ Admin: change status (approve/reject) + optional note
const changeStatus = asyncHandler(async (req, res) => {
  const travel = await TravelRequest.findById(req.params.id);
  if (!travel) {
    res.status(404);
    throw new Error("Travel request not found");
  }

  // only admin
  if (req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized as admin");
  }

  const { status, adminNote } = req.body;
  if (!["pending", "approved", "rejected"].includes(status)) {
    res.status(400);
    throw new Error("Invalid status");
  }

  travel.status = status;
  if (adminNote) travel.adminNote = adminNote;

  const updated = await travel.save();
  res.json(updated);
});

module.exports = {
  createTravel,
  getMyTravels,
  getAllTravels,
  getTravelById,
  updateTravel,
  deleteTravel,
  changeStatus,
};

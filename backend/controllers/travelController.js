const asyncHandler = require("express-async-handler");
const TravelRequest = require("../models/TravelRequest");
const ExpenseItem = require("../models/ExpenseItem");

// ======================================================
// HELPER FUNCTION - VALIDATE DATE
// ======================================================

const getDateOnly = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);

  return newDate;
};

// ======================================================
// CREATE TRAVEL REQUEST
// ======================================================

const createTravel = asyncHandler(async (req, res) => {
  const {
    title,
    purpose,
    destination,
    fromDate,
    toDate,
  } = req.body;

  // ==========================================
  // REQUIRED FIELD VALIDATION
  // ==========================================

  if (
    !title ||
    !purpose ||
    !destination ||
    !fromDate ||
    !toDate
  ) {
    res.status(400);

    throw new Error(
      "Please provide title, purpose, destination, fromDate and toDate"
    );
  }

  // ==========================================
  // EMPTY STRING VALIDATION
  // ==========================================

  if (!title.trim()) {
    res.status(400);
    throw new Error("Title cannot be empty");
  }

  if (!purpose.trim()) {
    res.status(400);
    throw new Error("Purpose cannot be empty");
  }

  if (!destination.trim()) {
    res.status(400);
    throw new Error("Destination cannot be empty");
  }

  // ==========================================
  // DATE VALIDATION
  // ==========================================

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedFromDate = getDateOnly(fromDate);
  const selectedToDate = getDateOnly(toDate);

  // From date cannot be in past
  if (selectedFromDate < today) {
    res.status(400);

    throw new Error(
      "From date cannot be in the past"
    );
  }

  // To date cannot be before from date
  if (selectedToDate < selectedFromDate) {
    res.status(400);

    throw new Error(
      "To date cannot be earlier than from date"
    );
  }

  // ==========================================
  // CREATE TRAVEL
  // ==========================================

  const travel = await TravelRequest.create({
    user: req.user._id,

    title: title.trim(),

    purpose: purpose.trim(),

    destination: destination.trim(),

    fromDate,

    toDate,

    status: "Pending",

    adminNote: "",
  });

  res.status(201).json(travel);
});

// ======================================================
// GET LOGGED-IN USER'S TRAVELS
// ======================================================

const getMyTravels = asyncHandler(async (req, res) => {
  const travels = await TravelRequest.find({
    user: req.user._id,
  }).sort({
    createdAt: -1,
  });

  res.status(200).json(travels);
});

// ======================================================
// ADMIN - GET ALL TRAVELS
// ======================================================

const getAllTravels = asyncHandler(async (req, res) => {
  const travels = await TravelRequest.find()
    .populate(
      "user",
      "name email role"
    )
    .sort({
      createdAt: -1,
    });

  res.status(200).json(travels);
});

// ======================================================
// GET SINGLE TRAVEL
// OWNER OR ADMIN
// ======================================================

const getTravelById = asyncHandler(async (req, res) => {
  const travel =
    await TravelRequest.findById(
      req.params.id
    ).populate(
      "user",
      "name email role"
    );

  if (!travel) {
    res.status(404);

    throw new Error(
      "Travel request not found"
    );
  }

  const isOwner =
    travel.user._id.toString() ===
    req.user._id.toString();

  const isAdmin =
    req.user.role === "admin";

  // ==========================================
  // ONLY OWNER OR ADMIN
  // ==========================================

  if (!isOwner && !isAdmin) {
    res.status(403);

    throw new Error(
      "Not authorized to view this travel request"
    );
  }

  res.status(200).json(travel);
});

// ======================================================
// UPDATE TRAVEL
// OWNER CAN UPDATE ONLY PENDING REQUEST
// ADMIN CAN UPDATE ANY REQUEST
// ======================================================

const updateTravel = asyncHandler(async (req, res) => {
  const travel =
    await TravelRequest.findById(
      req.params.id
    );

  if (!travel) {
    res.status(404);

    throw new Error(
      "Travel request not found"
    );
  }

  const isOwner =
    travel.user.toString() ===
    req.user._id.toString();

  const isAdmin =
    req.user.role === "admin";

  // ==========================================
  // ONLY OWNER OR ADMIN
  // ==========================================

  if (!isOwner && !isAdmin) {
    res.status(403);

    throw new Error(
      "Not authorized to update this travel request"
    );
  }

  // ==========================================
  // USER CAN EDIT ONLY PENDING REQUEST
  // ==========================================

  if (
    !isAdmin &&
    travel.status !== "Pending"
  ) {
    res.status(400);

    throw new Error(
      "You cannot edit a travel request after it has been reviewed"
    );
  }

  const {
    title,
    purpose,
    destination,
    fromDate,
    toDate,
  } = req.body;

  // ==========================================
  // FINAL DATES FOR VALIDATION
  // ==========================================

  const finalFromDate =
    fromDate !== undefined
      ? fromDate
      : travel.fromDate;

  const finalToDate =
    toDate !== undefined
      ? toDate
      : travel.toDate;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectedFromDate =
    getDateOnly(finalFromDate);

  const selectedToDate =
    getDateOnly(finalToDate);

  // ==========================================
  // FROM DATE CANNOT BE IN PAST
  // ==========================================

  if (selectedFromDate < today) {
    res.status(400);

    throw new Error(
      "From date cannot be in the past"
    );
  }

  // ==========================================
  // TO DATE CANNOT BE BEFORE FROM DATE
  // ==========================================

  if (selectedToDate < selectedFromDate) {
    res.status(400);

    throw new Error(
      "To date cannot be earlier than from date"
    );
  }

  // ==========================================
  // UPDATE TITLE
  // ==========================================

  if (title !== undefined) {
    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      res.status(400);

      throw new Error(
        "Title cannot be empty"
      );
    }

    travel.title = title.trim();
  }

  // ==========================================
  // UPDATE PURPOSE
  // ==========================================

  if (purpose !== undefined) {
    if (
      typeof purpose !== "string" ||
      !purpose.trim()
    ) {
      res.status(400);

      throw new Error(
        "Purpose cannot be empty"
      );
    }

    travel.purpose = purpose.trim();
  }

  // ==========================================
  // UPDATE DESTINATION
  // ==========================================

  if (destination !== undefined) {
    if (
      typeof destination !== "string" ||
      !destination.trim()
    ) {
      res.status(400);

      throw new Error(
        "Destination cannot be empty"
      );
    }

    travel.destination =
      destination.trim();
  }

  // ==========================================
  // UPDATE DATES
  // ==========================================

  if (fromDate !== undefined) {
    travel.fromDate = fromDate;
  }

  if (toDate !== undefined) {
    travel.toDate = toDate;
  }

  // ==========================================
  // SAVE UPDATED TRAVEL
  // ==========================================

  const updatedTravel =
    await travel.save();

  res.status(200).json(
    updatedTravel
  );
});

// ======================================================
// DELETE TRAVEL
// OWNER CAN DELETE ONLY PENDING REQUEST
// ADMIN CAN DELETE ANY REQUEST
// ALSO DELETE RELATED EXPENSES
// ======================================================

const deleteTravel = asyncHandler(async (req, res) => {
  const travel =
    await TravelRequest.findById(
      req.params.id
    );

  if (!travel) {
    res.status(404);

    throw new Error(
      "Travel request not found"
    );
  }

  const isOwner =
    travel.user.toString() ===
    req.user._id.toString();

  const isAdmin =
    req.user.role === "admin";

  // ==========================================
  // ONLY OWNER OR ADMIN
  // ==========================================

  if (!isOwner && !isAdmin) {
    res.status(403);

    throw new Error(
      "Not authorized to delete this travel request"
    );
  }

  // ==========================================
  // USER CAN DELETE ONLY PENDING REQUEST
  // ==========================================

  if (
    !isAdmin &&
    travel.status !== "Pending"
  ) {
    res.status(400);

    throw new Error(
      "You cannot delete a travel request after it has been reviewed"
    );
  }

  // ==========================================
  // DELETE RELATED EXPENSES
  // ==========================================

  await ExpenseItem.deleteMany({
    travelRequest: travel._id,
  });

  // ==========================================
  // DELETE TRAVEL
  // ==========================================

  await TravelRequest.deleteOne({
    _id: travel._id,
  });

  res.status(200).json({
    success: true,

    message:
      "Travel request and related expenses deleted successfully",
  });
});

// ======================================================
// ADMIN - CHANGE TRAVEL STATUS
// ======================================================

const changeStatus = asyncHandler(async (req, res) => {
  const {
    status,
    adminNote,
  } = req.body;

  // ==========================================
  // STATUS VALIDATION
  // ==========================================

  if (
    !["Pending", "Approved", "Rejected"].includes(
      status
    )
  ) {
    res.status(400);

    throw new Error(
      "Invalid status. Use Pending, Approved or Rejected"
    );
  }

  const travel =
    await TravelRequest.findById(
      req.params.id
    );

  if (!travel) {
    res.status(404);

    throw new Error(
      "Travel request not found"
    );
  }

  // ==========================================
  // UPDATE STATUS
  // ==========================================

  travel.status = status;

  // ==========================================
  // UPDATE ADMIN NOTE
  // ==========================================

  if (adminNote !== undefined) {
    if (typeof adminNote !== "string") {
      res.status(400);

      throw new Error(
        "Admin note must be a valid text"
      );
    }

    travel.adminNote =
      adminNote.trim();
  }

  // ==========================================
  // SAVE
  // ==========================================

  const updatedTravel =
    await travel.save();

  // Populate user details
  const populatedTravel =
    await updatedTravel.populate(
      "user",
      "name email role"
    );

  res.status(200).json(
    populatedTravel
  );
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  createTravel,
  getMyTravels,
  getAllTravels,
  getTravelById,
  updateTravel,
  deleteTravel,
  changeStatus,
};
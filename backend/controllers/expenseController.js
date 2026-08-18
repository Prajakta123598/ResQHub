const asyncHandler = require("express-async-handler");
const ExpenseItem = require("../models/ExpenseItem");
const TravelRequest = require("../models/TravelRequest");

// ==================================================
// ADD EXPENSE
// ONLY FOR APPROVED TRAVEL
// POST /api/expenses
// ==================================================

const addExpense = asyncHandler(async (req, res) => {
  const { travelRequest, title, amount } = req.body;

  if (
    !travelRequest ||
    !title ||
    amount === undefined ||
    amount === null
  ) {
    res.status(400);
    throw new Error(
      "Please provide travelRequest, title and amount"
    );
  }

  if (!title.trim()) {
    res.status(400);
    throw new Error("Expense title cannot be empty");
  }

  if (Number(amount) < 0) {
    res.status(400);
    throw new Error("Amount cannot be negative");
  }

  // ==========================================
  // FIND TRAVEL
  // ==========================================

  const travel = await TravelRequest.findById(
    travelRequest
  );

  if (!travel) {
    res.status(404);
    throw new Error("Travel request not found");
  }

  // ==========================================
  // ONLY OWNER OR ADMIN
  // ==========================================

  if (
    travel.user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error(
      "Not authorized to add expenses to this travel request"
    );
  }

  // ==========================================
  // ONLY APPROVED TRAVEL CAN HAVE EXPENSES
  // ==========================================

  if (travel.status !== "Approved") {
    res.status(400);
    throw new Error(
      "Expenses can only be added after the travel request is approved"
    );
  }

  // ==========================================
  // CREATE EXPENSE
  // ==========================================

  const expense = await ExpenseItem.create({
    travelRequest,
    title: title.trim(),
    amount: Number(amount),
    createdBy: req.user._id,
  });

  res.status(201).json(expense);
});

// ==================================================
// GET EXPENSES BY TRAVEL
// ONLY OWNER OR ADMIN
// GET /api/expenses/:travelRequestId
// ==================================================

const getExpensesByTravel = asyncHandler(
  async (req, res) => {
    const travel = await TravelRequest.findById(
      req.params.travelRequestId
    );

    if (!travel) {
      res.status(404);
      throw new Error("Travel request not found");
    }

    // ==========================================
    // ONLY OWNER OR ADMIN
    // ==========================================

    if (
      travel.user.toString() !==
        req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      res.status(403);
      throw new Error(
        "Not authorized to view expenses for this travel request"
      );
    }

    // ==========================================
    // REJECTED TRAVEL
    // ==========================================

    if (travel.status === "Rejected") {
      res.status(400);
      throw new Error(
        "Expenses are not available for rejected travel requests"
      );
    }

    const expenses = await ExpenseItem.find({
      travelRequest: req.params.travelRequestId,
    })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(expenses);
  }
);

// ==================================================
// UPDATE EXPENSE
// ONLY FOR APPROVED TRAVEL
// ==================================================

const updateExpense = asyncHandler(async (req, res) => {
  const expense = await ExpenseItem.findById(
    req.params.id
  );

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  // ==========================================
  // FIND RELATED TRAVEL
  // ==========================================

  const travel = await TravelRequest.findById(
    expense.travelRequest
  );

  if (!travel) {
    res.status(404);
    throw new Error("Related travel request not found");
  }

  // ==========================================
  // ONLY EXPENSE CREATOR OR ADMIN
  // ==========================================

  if (
    expense.createdBy.toString() !==
      req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error(
      "Not authorized to update this expense"
    );
  }

  // ==========================================
  // ONLY APPROVED TRAVEL
  // ==========================================

  if (travel.status !== "Approved") {
    res.status(400);
    throw new Error(
      "Expenses can only be updated for approved travel requests"
    );
  }

  const { title, amount } = req.body;

  if (title !== undefined) {
    if (!title.trim()) {
      res.status(400);
      throw new Error(
        "Expense title cannot be empty"
      );
    }

    expense.title = title.trim();
  }

  if (amount !== undefined) {
    if (Number(amount) < 0) {
      res.status(400);
      throw new Error(
        "Amount cannot be negative"
      );
    }

    expense.amount = Number(amount);
  }

  const updatedExpense = await expense.save();

  res.status(200).json(updatedExpense);
});

// ==================================================
// DELETE EXPENSE
// ONLY FOR APPROVED TRAVEL
// ==================================================

const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await ExpenseItem.findById(
    req.params.id
  );

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  // ==========================================
  // FIND RELATED TRAVEL
  // ==========================================

  const travel = await TravelRequest.findById(
    expense.travelRequest
  );

  if (!travel) {
    res.status(404);
    throw new Error("Related travel request not found");
  }

  // ==========================================
  // ONLY EXPENSE CREATOR OR ADMIN
  // ==========================================

  if (
    expense.createdBy.toString() !==
      req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error(
      "Not authorized to delete this expense"
    );
  }

  // ==========================================
  // ONLY APPROVED TRAVEL
  // ==========================================

  if (travel.status !== "Approved") {
    res.status(400);
    throw new Error(
      "Expenses can only be deleted for approved travel requests"
    );
  }

  await ExpenseItem.deleteOne({
    _id: expense._id,
  });

  res.status(200).json({
    success: true,
    message: "Expense deleted successfully",
  });
});

// ==================================================
// EXPORTS
// ==================================================

module.exports = {
  addExpense,
  getExpensesByTravel,
  updateExpense,
  deleteExpense,
};
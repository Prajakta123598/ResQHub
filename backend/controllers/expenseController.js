const ExpenseItem = require("../models/ExpenseItem");
const asyncHandler = require("express-async-handler");

// ➕ Add new expense
const addExpense = asyncHandler(async (req, res) => {
  const { travelRequest, title, amount } = req.body;

  if (!travelRequest || !title || !amount) {
    res.status(400);
    throw new Error("Please provide travelRequest, title, and amount");
  }

  const expense = await ExpenseItem.create({
    travelRequest,
    title,
    amount,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, expense });
});

// 📂 Get all expenses for a travel request
const getExpensesByTravel = asyncHandler(async (req, res) => {
  const expenses = await ExpenseItem.find({
    travelRequest: req.params.travelRequestId,
  }).populate("createdBy", "name email");

  res.json({ success: true, expenses });
});

// ✏️ Update expense
const updateExpense = asyncHandler(async (req, res) => {
  const expense = await ExpenseItem.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  // Only owner or admin can update
  if (
    expense.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  expense.title = req.body.title || expense.title;
  expense.amount = req.body.amount || expense.amount;

  const updatedExpense = await expense.save();
  res.json({ success: true, expense: updatedExpense });
});

// ❌ Delete expense
const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await ExpenseItem.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  // Only owner or admin can delete
  if (
    expense.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await expense.deleteOne();
  res.json({ success: true, message: "Expense deleted" });
});

module.exports = {
  addExpense,
  getExpensesByTravel,
  updateExpense,
  deleteExpense,
};

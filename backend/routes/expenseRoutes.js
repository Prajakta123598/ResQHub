const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addExpense,
  getExpensesByTravel,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const router = express.Router();

// ➕ Add new expense
router.post("/", protect, addExpense);

// 📂 Get all expenses for a specific travel request
router.get("/:travelRequestId", protect, getExpensesByTravel);

// ✏️ Update expense
router.put("/:id", protect, updateExpense);

// ❌ Delete expense
router.delete("/:id", protect, deleteExpense);

module.exports = router;

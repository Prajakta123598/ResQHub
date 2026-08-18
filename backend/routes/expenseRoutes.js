const express = require("express");
const router = express.Router();

const {
  addExpense,
  getExpensesByTravel,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

const { protect } = require("../middleware/authMiddleware");

// ==========================================
// ADD EXPENSE
// POST /api/expenses
// ==========================================

router.post("/", protect, addExpense);

// ==========================================
// GET EXPENSES BY TRAVEL ID
// GET /api/expenses/travel/:travelRequestId
// ==========================================

router.get(
  "/travel/:travelRequestId",
  protect,
  getExpensesByTravel
);

// ==========================================
// UPDATE EXPENSE
// PUT /api/expenses/:id
// ==========================================

router.put("/:id", protect, updateExpense);

// ==========================================
// DELETE EXPENSE
// DELETE /api/expenses/:id
// ==========================================

router.delete("/:id", protect, deleteExpense);

module.exports = router;
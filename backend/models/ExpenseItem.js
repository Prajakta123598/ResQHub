const mongoose = require("mongoose");

const expenseItemSchema = new mongoose.Schema(
  {
    travelRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelRequest", // Linked to TravelRequest
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ExpenseItem = mongoose.model("ExpenseItem", expenseItemSchema);

module.exports = ExpenseItem; // ✅ CommonJS export

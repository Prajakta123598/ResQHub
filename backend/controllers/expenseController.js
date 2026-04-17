const deleteExpense = asyncHandler(async (req, res) => {
  console.log("DELETE expense id:", req.params.id);

  const expense = await ExpenseItem.findById(req.params.id);

  if (!expense) {
    res.status(404);
    throw new Error("Expense not found");
  }

  if (
    expense.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await expense.deleteOne();

  res.json({ success: true, message: "Expense deleted successfully" });
});
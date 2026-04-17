require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");

// ✅ Import routes
const userRoutes = require("./routes/userRoutes");
const travelRoutes = require("./routes/travelRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const fireAlertRoutes = require("./routes/fireAlertRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// ✅ Test root route
app.get("/", (req, res) => {
  res.send("🚀 ResQHub Backend is running!");
});

// ✅ Health check
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from backend 👋" });
});

// ✅ MongoDB Test Route
app.get("/api/test", async (req, res) => {
  try {
    const dbs = await mongoose.connection.db.admin().listDatabases();

    res.json({
      message: "✅ MongoDB connected successfully!",
      databases: dbs.databases.map((db) => db.name),
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ MongoDB test failed",
      error: error.message,
    });
  }
});

// ✅ Mount routes
app.use("/api/users", userRoutes);
app.use("/api/travels", travelRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/alerts", fireAlertRoutes);

// ✅ 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

// ✅ Start server after DB connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();
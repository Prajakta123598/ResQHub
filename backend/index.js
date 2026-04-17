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

// 🔍 ENV CHECK
console.log("🔍 ENV CHECK:", {
  MONGO_URI: !!process.env.MONGO_URI,
  JWT_SECRET: !!process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
});

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

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/travels", travelRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/alerts", fireAlertRoutes);

// ✅ 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).json({
    success: false,
    message: err.message,
  });
});

// ✅ Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:");
    console.error(error);
    process.exit(1);
  }
};

startServer();
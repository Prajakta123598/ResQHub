const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// =========================
// MIDDLEWARE
// =========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// =========================
// ENV CHECK
// =========================

console.log("🔍 ENV CHECK:", {
  MONGO_URI: !!process.env.MONGO_URI,
  JWT_SECRET: !!process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
});

// =========================
// ROUTES
// =========================

const userRoutes = require("./routes/userRoutes");
const travelRoutes = require("./routes/travelRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const fireAlertRoutes = require("./routes/fireAlertRoutes");

// =========================
// API ROUTES
// =========================

app.use("/api/users", userRoutes);

app.use("/api/travels", travelRoutes);

app.use("/api/expenses", expenseRoutes);

app.use("/api/alerts", fireAlertRoutes);

// =========================
// BASIC ROUTES
// =========================

app.get("/", (req, res) => {
  res.json({
    message: "🚀 ResQHub Backend is running!",
  });
});

app.get("/api/hello", (req, res) => {
  res.json({
    message: "Hello from ResQHub Backend 👋",
  });
});

// =========================
// 404 ROUTE
// =========================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// =========================
// ERROR HANDLER
// =========================

app.use((err, req, res, next) => {
  console.error("❌ ERROR:", err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// =========================
// MONGODB + SERVER
// =========================

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected:", mongoose.connection.host);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  });
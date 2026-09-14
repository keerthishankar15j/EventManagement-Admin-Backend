const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const eventRoutes = require("../Router/EventRouter");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

// =====================================================
// MONGODB CONNECTION
// =====================================================

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(process.env.MONGO_URI);

  isConnected = true;

  console.log("MongoDB connected successfully");
};

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", async (req, res) => {
  try {
    await connectDB();

    res.json({
      success: true,
      message: "Admin API is working!",
      database: "Connected",
    });
  } catch (error) {
    console.log("DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// =====================================================
// EVENT ROUTES
// =====================================================

app.use("/events", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.log("DATABASE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
}, eventRoutes);

// =====================================================
// LOCAL SERVER
// =====================================================

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 9000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// =====================================================
// EXPORT FOR VERCEL
// =====================================================

module.exports = app;
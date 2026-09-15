const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

// =====================================================
// ROUTES
// =====================================================

const eventRoutes = require("./src/Router/EventRouter");

const loginActivityRoutes = require(
  "./src/Router/UserActivityRouter"
);

// =====================================================
// APP
// =====================================================

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

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// STATIC UPLOADS
// =====================================================

const uploadFolder = path.join(__dirname, "uploads");

app.use(
  "/uploads",
  express.static(uploadFolder)
);

// =====================================================
// MONGODB CONNECTION
// =====================================================

let isConnected = false;

const connectDB = async () => {
  try {
    // Already connected
    if (
      isConnected &&
      mongoose.connection.readyState === 1
    ) {
      return;
    }

    // Check MongoDB URL
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in .env file"
      );
    }

    // Connect MongoDB
    await mongoose.connect(
      process.env.MONGO_URI
    );

    isConnected = true;

    console.log("MongoDB connected successfully");
  } catch (error) {
    isConnected = false;

    console.error(
      "MongoDB connection error:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "Admin API is working!",
      database: "Connected",
    });
  } catch (error) {
    console.error(
      "ROOT DB ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// =====================================================
// DATABASE MIDDLEWARE FOR EVENTS
// =====================================================

app.use(
  "/events",
  async (req, res, next) => {
    try {
      await connectDB();

      next();
    } catch (error) {
      console.error(
        "DATABASE CONNECTION ERROR:",
        error
      );

      res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });
    }
  }
);

// =====================================================
// EVENT ROUTES
// =====================================================

app.use(
  "/events",
  eventRoutes
);

// =====================================================
// LOGIN ACTIVITY ROUTES
// =====================================================
//
// This route does NOT use your MongoDB.
// It calls your friend's Login Activity API
// from UserActivityController.js.
//
// Example:
// GET /login-activity/users
//
// =====================================================

app.use(
  "/login-activity",
  loginActivityRoutes
);

// =====================================================
// EVENT TEST ROUTE
// =====================================================

app.get(
  "/events/test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "EVENT ROUTE WORKING",
    });
  }
);

// =====================================================
// LOGIN ACTIVITY TEST ROUTE
// =====================================================

app.get(
  "/login-activity/test",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "LOGIN ACTIVITY ROUTE WORKING",
    });
  }
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  }
);

// =====================================================
// EXPORT FOR VERCEL
// =====================================================

module.exports = app;
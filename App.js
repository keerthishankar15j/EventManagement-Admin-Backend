const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const eventRoutes = require("./src/Router/EventRouter");
const loginActivityRoutes = require("./src/Router/UserActivityRouter");
const userContactRoutes = require("./src/Router/UserContactRouter");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// =====================================================
// MONGODB CONNECTION
// =====================================================

let isConnected = false;

const connectDB = async () => {
  try {
    if (
      isConnected &&
      mongoose.connection.readyState === 1
    ) {
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined"
      );
    }

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
// STATIC UPLOADS
// =====================================================

const uploadFolder = path.join(
  __dirname,
  "uploads"
);

app.use(
  "/uploads",
  express.static(uploadFolder)
);


// =====================================================
// ROOT
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

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });

  }
});


// =====================================================
// EVENTS
// =====================================================

app.use(
  "/events",
  async (req, res, next) => {

    try {
      await connectDB();
      next();

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });

    }

  }
);

app.use(
  "/events",
  eventRoutes
);


// =====================================================
// LOGIN ACTIVITY
// =====================================================

app.use(
  "/login-activity",
  async (req, res, next) => {

    try {
      await connectDB();
      next();

    } catch (error) {

      res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });

    }

  }
);

app.use(
  "/login-activity",
  loginActivityRoutes
);


// =====================================================
// USER CONTACT
// =====================================================
//
// IMPORTANT:
// This route fetches data from the friend's API.
// It does NOT need MongoDB.
//
// =====================================================

app.use(
  "/user-contact",
  userContactRoutes
);


// =====================================================
// TEST
// =====================================================

app.get(
  "/user-contact/test",
  (req, res) => {

    res.status(200).json({
      success: true,
      message: "USER CONTACT ROUTE WORKING",
    });

  }
);


// =====================================================
// 404
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


module.exports = app;
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

// =====================================================
// BOOKING ROUTER
// =====================================================

const bookingRoutes = require(
  "./src/Router/BookingRouter"
);

// =====================================================
// APP
// =====================================================

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  "https://event-admin-one.vercel.app",

  "https://event-user-one.vercel.app",

  "https://eventuser-two.vercel.app",
];

app.use(
  cors({
    origin: function (
      origin,
      callback
    ) {

      // Allow Postman / browser without origin
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin)
      ) {
        return callback(null, true);
      }

      console.log(
        "Blocked CORS origin:",
        origin
      );

      return callback(null, false);
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: false,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =====================================================
// MONGODB CONNECTION
// =====================================================

let isConnected = false;

const connectDB = async () => {

  // Already connected
  if (
    isConnected &&
    mongoose.connection.readyState === 1
  ) {
    return;
  }

  // Check MONGO_URI
  if (!process.env.MONGO_URI) {

    throw new Error(
      "MONGO_URI is missing in Vercel Environment Variables"
    );
  }

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    isConnected = true;

    console.log(
      "MongoDB connected successfully"
    );

  } catch (error) {

    isConnected = false;

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// ROOT
// =====================================================

app.get(
  "/",
  async (req, res) => {

    try {

      await connectDB();

      return res.status(200).json({
        success: true,
        message:
          "Eventora Admin API is working!",
        database: "Connected",
      });

    } catch (error) {

      console.error(
        "ROOT ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Database connection failed",
        error: error.message,
      });
    }
  }
);

// =====================================================
// BOOKING DATABASE MIDDLEWARE
// =====================================================

app.use(
  "/bookings",
  async (
    req,
    res,
    next
  ) => {

    try {

      await connectDB();

      console.log(
        `BOOKING REQUEST: ${req.method} ${req.originalUrl}`
      );

      next();

    } catch (error) {

      console.error(
        "BOOKING DATABASE ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Booking database connection failed",
        error: error.message,
      });
    }
  }
);

// =====================================================
// BOOKING ROUTES
// =====================================================

app.use(
  "/bookings",
  bookingRoutes
);

// =====================================================
// 404
// =====================================================

app.use(
  (req, res) => {

    return res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL ERROR
// =====================================================

app.use(
  (
    error,
    req,
    res,
    next
  ) => {

    console.error(
      "GLOBAL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = app;
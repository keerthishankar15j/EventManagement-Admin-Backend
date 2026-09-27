const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const eventRoutes = require("./src/Router/EventRouter");
const loginActivityRoutes = require("./src/Router/UserActivityRouter");
const userContactRoutes = require("./src/Router/UserContactRouter");
const OrganizationRouter = require("./src/Router/OrganizationRouter");

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://event-admin-one.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without an origin
      // Example: Postman / server-to-server
      if (!origin) {
        return callback(null, true);
      }

      // Allow known frontend origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "Blocked CORS origin:",
        origin
      );

      // Don't crash the server
      return callback(null, false);
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
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
// BODY MIDDLEWARE
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
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

    // Check MONGO_URI
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in environment variables"
      );
    }

    // Connect MongoDB
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

    return res.status(200).json({
      success: true,
      message: "Admin API is working!",
      database: "Connected",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message:
        "Database connection failed",
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

      return res.status(500).json({
        success: false,
        message:
          "Database connection failed",
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

      return res.status(500).json({
        success: false,
        message:
          "Database connection failed",
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
// This route does NOT connect to MongoDB.
// It gets contact/message data from friend's API.
// =====================================================

app.use(
  "/user-contact",
  userContactRoutes
);

// =====================================================
// ORGANIZATION
// =====================================================

app.use(
  "/organization",
  async (req, res, next) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      return res.status(500).json({
        success: false,
        message:
          "Database connection failed",
        error: error.message,
      });
    }
  }
);

app.use(
  "/organization",
  OrganizationRouter
);

// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {

  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "GLOBAL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error",
      error: error.message,
    });
  }
);

// =====================================================
// EXPORT APP
// =====================================================

module.exports = app;
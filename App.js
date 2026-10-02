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
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  // Admin Frontend
  "https://event-admin-one.vercel.app",

  // Current User Frontend
  "https://event-user-one.vercel.app",

  // Old User Frontend
  "https://eventuser-two.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / direct API requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("Blocked CORS origin:", origin);

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
  try {
    if (
      isConnected &&
      mongoose.connection.readyState === 1
    ) {
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in environment variables"
      );
    }

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
// ROOT ROUTE
// =====================================================

app.get("/", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "Eventora Admin API is working!",
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

app.use(
  "/user-contact",
  userContactRoutes
);

// =====================================================
// ORGANIZER REQUESTS
// =====================================================

app.use(
  "/organization",
  OrganizationRouter
);

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error(
    "GLOBAL ERROR:",
    error
  );

  res.status(500).json({
    success: false,
    message:
      error.message ||
      "Internal Server Error",
  });
});

// =====================================================
// VERCEL EXPORT
// =====================================================

module.exports = app;
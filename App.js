const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

// =====================================================
// ROUTES
// =====================================================

const userRoutes = require(
  "./src/Router/UserRouter"
);

const eventRoutes = require(
  "./src/Router/EventRouter"
);

const loginHistoryRoutes = require(
  "./src/Router/LoginHistoryRoute"
);

const app = express();

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "https://event-admin-one.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (
    origin,
    callback
  ) {
    // Allow Postman / server requests
    if (!origin) {
      return callback(
        null,
        true
      );
    }

    if (
      allowedOrigins.includes(origin)
    ) {
      return callback(
        null,
        true
      );
    }

    console.log(
      "CORS blocked:",
      origin
    );

    return callback(
      new Error(
        "Not allowed by CORS"
      )
    );
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

  credentials: true,
};

app.use(
  cors(corsOptions)
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(
  express.json()
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// UPLOADS
// =====================================================

const uploadFolder =
  path.join(
    __dirname,
    "uploads"
  );

app.use(
  "/uploads",
  express.static(
    uploadFolder
  )
);

// =====================================================
// DATABASE
// =====================================================

let isConnected = false;

const connectDB = async () => {

  if (
    isConnected &&
    mongoose.connection
      .readyState === 1
  ) {
    return;
  }

  if (
    !process.env.MONGO_URI
  ) {
    throw new Error(
      "MONGO_URI is not defined"
    );
  }

  await mongoose.connect(
    process.env.MONGO_URI
  );

  isConnected = true;

  console.log(
    "MongoDB connected successfully"
  );
};

// =====================================================
// DATABASE MIDDLEWARE
// =====================================================

app.use(
  async (
    req,
    res,
    next
  ) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      console.error(
        "DATABASE ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message:
          "Database connection failed",
        error:
          error.message,
      });

    }

  }
);

// =====================================================
// ROOT
// =====================================================

app.get(
  "/",
  (req, res) => {

    return res.status(200).json({
      success: true,
      message:
        "User API is working!",
      database:
        mongoose.connection
          .readyState === 1
          ? "Connected"
          : "Disconnected",
    });

  }
);

// =====================================================
// LOGIN / USERS
// =====================================================

app.use(
  "/login",
  userRoutes
);

// =====================================================
// LOGIN HISTORY
// =====================================================

app.use(
  "/loginhistory",
  loginHistoryRoutes
);

// =====================================================
// EVENTS
// =====================================================

app.use(
  "/events",
  eventRoutes
);

// =====================================================
// 404
// =====================================================

app.use(
  (req, res) => {

    return res.status(404).json({
      success: false,
      message:
        "API route not found",
      path:
        req.originalUrl,
    });

  }
);

// =====================================================
// ERROR HANDLER
// =====================================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(
      "UNHANDLED SERVER ERROR:",
      err
    );

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
    });

  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = app;
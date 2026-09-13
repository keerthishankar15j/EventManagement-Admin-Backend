const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const userRoutes = require("./src/Router/UserRoute");
const eventRoutes = require("./src/Router/EventRouter");

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// STATIC FILES
// =====================================================

const uploadFolder = path.join(__dirname, "uploads");

app.use(
  "/uploads",
  express.static(uploadFolder)
);

// =====================================================
// MONGODB
// =====================================================

let isConnected = false;

const connectDB = async () => {
  if (
    isConnected &&
    mongoose.connection.readyState === 1
  ) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(process.env.MONGO_URI);

  isConnected = true;

  console.log("MongoDB connected");
};

// =====================================================
// DATABASE MIDDLEWARE
// =====================================================

app.use(async (req, res, next) => {
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
});

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Admin API is working!",
    database:
      mongoose.connection.readyState === 1
        ? "Connected"
        : "Disconnected",
  });
});

// =====================================================
// USER ROUTES
// =====================================================

app.use("/login", userRoutes);

// =====================================================
// LOGIN HISTORY
// =====================================================

// If you have LoginHistoryRoute.js, uncomment:
//
// const loginHistoryRoutes = require(
//   "./src/Router/LoginHistoryRoute"
// );
//
// app.use(
//   "/loginhistory",
//   loginHistoryRoutes
// );

// =====================================================
// EVENT ROUTES
// =====================================================

app.use("/events", eventRoutes);

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error(
    "UNHANDLED SERVER ERROR:",
    err
  );

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// =====================================================
// VERCEL EXPORT
// =====================================================

module.exports = app;

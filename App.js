const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const eventRoutes = require("./src/Router/EventRouter");
const userRoutes = require("./routes/UserRoute");
const loginHistoryRoutes = require("./routes/LoginHistoryRoute");

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: [
      "https://event-admin-one.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
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
// STATIC
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
    throw new Error(
      "MONGO_URI is not defined"
    );
  }

  await mongoose.connect(
    process.env.MONGO_URI
  );

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

    return res.status(500).json({
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
    database: "Connected",
  });
});

// =====================================================
// USER ROUTES
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
// EVENT ROUTES
// =====================================================

app.use(
  "/events",
  eventRoutes
);

// =====================================================
// EVENT TEST
// =====================================================

app.get(
  "/events/test",
  (req, res) => {
    res.json({
      success: true,
      message: "EVENT ROUTE WORKING",
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
      message: "API route not found",
      path: req.originalUrl,
    });
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = app;

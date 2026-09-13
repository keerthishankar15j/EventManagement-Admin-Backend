const express = require("express");
const cors = require("cors");

const app = express();

// =====================================================
// ROUTES
// =====================================================

const userRoutes = require("./src/Router/UserRouter");
const eventRoutes = require("./src/Router/EventRouter");
const loginHistoryRoutes = require("./src/Router/LoginHistoryRoute");

// =====================================================
// CORS CONFIGURATION
// =====================================================

app.use(
  cors({
    origin: "https://event-admin-one.vercel.app",

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
// API ROUTES
// =====================================================

app.use("/login", userRoutes);

app.use("/events", eventRoutes);

app.use(
  "/loginhistory",
  loginHistoryRoutes
);

// =====================================================
// ROOT API
// =====================================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Event Management API is running",
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// =====================================================
// EXPORT APP
// =====================================================

module.exports = app;
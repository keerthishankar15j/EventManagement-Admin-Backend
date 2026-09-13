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
// CORS
// =====================================================

app.use(
  cors({
    origin: "https://event-admin-one.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// API ROUTES
// =====================================================

app.use("/login", userRoutes);

app.use("/events", eventRoutes);

app.use("/loginhistory", loginHistoryRoutes);

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
// 404 HANDLER
// =====================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// EXPORT
// =====================================================

module.exports = app;
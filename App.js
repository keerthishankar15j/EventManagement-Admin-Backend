const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const eventRoutes = require("./src/Router/EventRouter");

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

console.log("SERVING UPLOADS FROM:", uploadFolder);

app.use(
  "/uploads",
  express.static(uploadFolder)
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Admin API is working!",
  });
});

// =====================================================
// EVENT ROUTES
// =====================================================

app.use("/events", eventRoutes);

// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// =====================================================
// EXPORT FOR VERCEL
// =====================================================

module.exports = app;
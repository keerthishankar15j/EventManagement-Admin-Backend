const express = require("express");
const cors = require("cors");
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

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// MONGODB CONNECTION
// =====================================================

const connectDB = async () => {
  try {
    // Already connected
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // Connection is currently being established
    if (mongoose.connection.readyState === 2) {
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

    console.log(
      "MongoDB connected successfully"
    );
  } catch (error) {
    console.error(
      "MongoDB CONNECTION ERROR:",
      error
    );

    throw error;
  }
};

// =====================================================
// TEST ROUTE
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
    console.error(
      "ROOT DATABASE ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Database connection failed",
      error: error.message,
    });
  }
});

// =====================================================
// EVENT ROUTES
// =====================================================

app.use(
  "/events",
  async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error(
        "EVENT DATABASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Database connection failed",
        error: error.message,
      });
    }
  },
  eventRoutes
);

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// GLOBAL ERROR
// =====================================================

app.use(
  (err, req, res, next) => {
    console.error(
      "GLOBAL ERROR:",
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
// LOCAL SERVER
// =====================================================

if (
  process.env.NODE_ENV !==
  "production"
) {
  const PORT =
    process.env.PORT || 9000;

  app.listen(PORT, () => {
    console.log(
      `Server running on port ${PORT}`
    );
  });
}

// =====================================================
// VERCEL EXPORT
// =====================================================

module.exports = app;
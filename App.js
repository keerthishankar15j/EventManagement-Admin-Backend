const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const eventRoutes = require("./src/Router/EventRouter");

const app = express();

// =====================================================
// BASIC CONFIGURATION
// =====================================================

const PORT = process.env.PORT || 9000;

// =====================================================
// CORS
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

let connectionPromise = null;

const connectDB = async () => {
  try {
    // Already connected
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    // Connection already in progress
    if (connectionPromise) {
      await connectionPromise;
      return mongoose.connection;
    }

    // Check MONGO_URI
    if (!process.env.MONGO_URI) {
      throw new Error(
        "MONGO_URI is not defined in .env"
      );
    }

    console.log("---------------------------------");
    console.log("Connecting to MongoDB...");
    console.log("---------------------------------");

    connectionPromise = mongoose.connect(
      process.env.MONGO_URI
    );

    await connectionPromise;

    connectionPromise = null;

    console.log("=================================");
    console.log("MongoDB connected successfully");
    console.log(
      "Database:",
      mongoose.connection.name
    );
    console.log(
      "MongoDB Host:",
      mongoose.connection.host
    );
    console.log(
      "Connection State:",
      mongoose.connection.readyState
    );
    console.log("=================================");

    return mongoose.connection;

  } catch (error) {
    connectionPromise = null;

    console.error("=================================");
    console.error("MongoDB CONNECTION FAILED");
    console.error("Error:", error.message);
    console.error("=================================");

    throw error;
  }
};

// =====================================================
// MONGODB CONNECTION EVENTS
// =====================================================

mongoose.connection.on("connected", () => {
  console.log("MongoDB event: CONNECTED");
});

mongoose.connection.on("error", (error) => {
  console.error(
    "MongoDB event ERROR:",
    error.message
  );
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB event: DISCONNECTED");
});

// =====================================================
// TEST / ROOT ROUTE
// =====================================================

app.get("/", async (req, res) => {
  try {
    await connectDB();

    return res.status(200).json({
      success: true,
      message: "Admin API is working!",
      database: "Connected",
      databaseName: mongoose.connection.name,
    });

  } catch (error) {
    console.error(
      "ROOT DATABASE ERROR:",
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
// DATABASE MIDDLEWARE FOR EVENT ROUTES
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
        message: "Database connection failed",
        error: error.message,
      });
    }
  },
  eventRoutes
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
  (err, req, res, next) => {
    console.error("=================================");
    console.error("GLOBAL ERROR");
    console.error(err);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal server error",
      error: err.message,
    });
  }
);

// =====================================================
// LOCAL DEVELOPMENT SERVER
// =====================================================

const startLocalServer = async () => {
  try {
    console.log("");
    console.log("=================================");
    console.log("STARTING EVENT MANAGEMENT API");
    console.log("=================================");

    // Connect MongoDB before starting server
    await connectDB();

    console.log("");
    console.log("Database check completed");
    console.log("MongoDB Status: CONNECTED");
    console.log("");

    app.listen(PORT, () => {
      console.log("=================================");
      console.log("SERVER STARTED SUCCESSFULLY");
      console.log("=================================");
      console.log(
        `Server running on port ${PORT}`
      );
      console.log(
        `Local URL: http://localhost:${PORT}`
      );
      console.log(
        `Events API: http://localhost:${PORT}/events`
      );
      console.log(
        `Get Events: http://localhost:${PORT}/events/getevents`
      );
      console.log("=================================");
      console.log("");
    });

  } catch (error) {
    console.error("");
    console.error("=================================");
    console.error("SERVER START FAILED");
    console.error("=================================");
    console.error(
      "MongoDB connection failed"
    );
    console.error(
      "Reason:",
      error.message
    );
    console.error("=================================");

    process.exit(1);
  }
};

// =====================================================
// START LOCAL SERVER
// =====================================================

if (process.env.NODE_ENV !== "production") {
  startLocalServer();
}

// =====================================================
// VERCEL EXPORT
// =====================================================

module.exports = app;
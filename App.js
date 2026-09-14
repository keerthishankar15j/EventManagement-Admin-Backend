const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();


// =====================================================
// ROUTERS
// =====================================================

const eventRoutes =
  require("./src/Router/EventRouter");

const AdminUserRouter =
  require("./src/Router/AdminUserRouter");

const LoginEmailRouter =
  require("./src/Router/LoginEmailRouter");


// =====================================================
// APP
// =====================================================

const app =
  express();


// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: "*",
  })
);


// =====================================================
// BODY
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
// MONGODB
// =====================================================

let isConnected = false;

const connectDB =
  async () => {

    if (
      isConnected &&
      mongoose.connection.readyState === 1
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
      "MongoDB connected"
    );
  };


// =====================================================
// ROOT
// =====================================================

app.get(
  "/",
  async (req, res) => {

    try {

      await connectDB();

      res.status(200).json({
        success: true,
        message:
          "Admin API is working!",
        database:
          "Connected",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  }
);


// =====================================================
// ADMIN DATABASE MIDDLEWARE
// =====================================================

app.use(
  "/admin",
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
        "ADMIN DATABASE ERROR:",
        error.message
      );

      res.status(500).json({
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
// ADMIN USERS
// =====================================================

app.use(
  "/admin",
  AdminUserRouter
);


// =====================================================
// LOGIN EMAIL
// =====================================================

app.use(
  "/admin",
  LoginEmailRouter
);


// =====================================================
// EVENTS
// =====================================================

app.use(
  "/events",
  async (
    req,
    res,
    next
  ) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Database connection failed",
      });

    }
  }
);

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
      message:
        "EVENT ROUTE WORKING",
    });

  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = app;
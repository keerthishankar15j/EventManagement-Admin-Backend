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

const uploadFolder =
  path.join(__dirname, "uploads");

app.use(
  "/uploads",
  express.static(uploadFolder)
);


// =====================================================
// MONGODB CONNECTION
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

      console.error(
        "ROOT DB ERROR:",
        error
      );


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
        error
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
// ADMIN USER ROUTES
// =====================================================

app.use(
  "/admin",
  AdminUserRouter
);


// =====================================================
// EVENT DATABASE MIDDLEWARE
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

      console.error(
        "DATABASE CONNECTION ERROR:",
        error
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

      message:
        "EVENT ROUTE WORKING",

    });

  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = app;
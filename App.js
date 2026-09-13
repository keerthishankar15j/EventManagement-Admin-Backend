const express = require("express");

const cors = require("cors");

const path = require("path");

const mongoose = require("mongoose");

require("dotenv").config();


// =====================================================
// ROUTERS
// =====================================================

const userRoutes =
  require("./src/Router/UserRouter");

const eventRoutes =
  require("./src/Router/EventRouter");

const loginHistoryRoutes =
  require("./src/Router/LoginHistory Route");


// =====================================================
// EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// CORS
// =====================================================

const corsOptions = {

  origin: [
    "https://event-admin-one.vercel.app",
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
  express.static(uploadFolder)
);


// =====================================================
// DATABASE CONNECTION
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
// DATABASE MIDDLEWARE
// =====================================================

app.use(
  async (req, res, next) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      console.error(
        "DATABASE CONNECTION ERROR:",
        error
      );

      return res
        .status(500)
        .json({

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
// HOME
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "User API is working!",

      database:
        mongoose.connection.readyState === 1
          ? "Connected"
          : "Disconnected",

    });

  }
);


// =====================================================
// USER ROUTES
// =====================================================

app.use(
  "/login",
  userRoutes
);


// =====================================================
// LOGIN HISTORY ROUTES
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
// 404
// =====================================================

app.use(
  (req, res) => {

    res.status(404).json({

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
  (err, req, res, next) => {

    console.error(
      "UNHANDLED SERVER ERROR:",
      err
    );

    res.status(500).json({

      success: false,

      message:
        "Internal server error",

      error:
        err.message,

    });

  }
);


module.exports = app;
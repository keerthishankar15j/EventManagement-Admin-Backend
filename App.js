const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const AdminUserRouter =
  require("./src/Router/AdminUserRouter");

const LoginEmailRouter =
  require("./src/Router/LoginEmailRouter");

const eventRoutes =
  require("./src/Router/EventRouter");

const app = express();


// CORS
app.use(
  cors({
    origin: "*",
  })
);


// BODY
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// UPLOADS
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// DATABASE
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


// DATABASE MIDDLEWARE
app.use(
  async (req, res, next) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      console.error(
        "DATABASE ERROR:",
        error.message
      );

      return res.status(500).json({
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
// ADMIN LOGIN ROUTES
// =====================================================

app.use(
  "/admin",
  LoginEmailRouter
);


// =====================================================
// EVENT ROUTES
// =====================================================

app.use(
  "/events",
  eventRoutes
);


// =====================================================
// ROOT
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Admin API is working",

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

      message:
        "Route not found",

      path:
        req.originalUrl,

    });

  }
);


// =====================================================
// LOCAL SERVER ONLY
// =====================================================

if (
  require.main === module
) {

  const PORT =
    process.env.PORT || 3000;

  app.listen(
    PORT,
    () => {

      console.log(
        `Admin Server running on port ${PORT}`
      );

    }
  );

}


module.exports =
  app;
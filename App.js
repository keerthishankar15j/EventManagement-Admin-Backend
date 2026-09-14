
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();


// =====================================================
// ROUTERS
// =====================================================

const AdminUserRouter =
  require("./src/Router/AdminUserRouter");

const LoginHistoryRouter =
  require("./src/Router/LoginHistoryRouter");

const eventRoutes =
  require("./src/Router/EventRouter");


const app = express();


// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://event-admin-one.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow Postman / Thunder Client
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "CORS blocked:",
        origin
      );

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    credentials: true,

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
// UPLOADS
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

const connectDB = async () => {

  try {

    if (
      mongoose.connection.readyState === 1
    ) {
      return;
    }

    const MONGO_URI =
      process.env.MONGO_URI;

    if (!MONGO_URI) {

      throw new Error(
        "MONGO_URI is not defined"
      );

    }

    await mongoose.connect(
      MONGO_URI,
      {
        serverSelectionTimeoutMS: 10000,
      }
    );

    console.log(
      "Admin MongoDB connected successfully"
    );

  } catch (error) {

    console.error(
      "MongoDB Error:",
      error.message
    );

    throw error;

  }

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
// LOGIN HISTORY ROUTES
// =====================================================

app.use(
  "/admin/login-history",
  LoginHistoryRouter
);


// =====================================================
// EVENT ROUTES
// =====================================================

app.use(
  "/events",
  eventRoutes
);


// =====================================================
// EVENT TEST ROUTE
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
// HOME
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Event Management Admin Backend is running",

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
// LOCAL SERVER
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


// =====================================================
// EXPORT
// =====================================================

module.exports = app;


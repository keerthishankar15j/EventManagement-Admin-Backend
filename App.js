const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();


const AdminUserRouter =
  require("./src/router/AdminUserRouter");


const app = express();


// =====================================================
// CORS
// =====================================================

const allowedOrigins = [

  "http://localhost:5173",

  "http://localhost:5174",

  // உங்கள் admin Vercel URL வந்ததும் இங்கே add செய்யவும்
  // "https://your-admin.vercel.app",

];


app.use(
  cors({

    origin: function (
      origin,
      callback
    ) {

      // Postman / Thunder Client
      if (!origin) {

        return callback(
          null,
          true
        );

      }


      if (
        allowedOrigins.includes(
          origin
        )
      ) {

        return callback(
          null,
          true
        );

      }


      console.log(
        "CORS blocked:",
        origin
      );


      return callback(
        new Error(
          "Not allowed by CORS"
        )
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
// MONGODB
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
  async (
    req,
    res,
    next
  ) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          "Database connection failed",

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

      message: "Route not found",

      path: req.originalUrl,

    });

  }
);


// =====================================================
// SERVER
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


module.exports = app;
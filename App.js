const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();


// =====================================================
// ROUTES
// =====================================================

const SignupRouter =
  require("./src/router/SignupRouter");

const LoginRouter =
  require("./src/router/LoginRouter");

const LoginHistoryRouter =
  require("./src/router/LoginHistoryRouter");

const AdminRouter =
  require("./src/router/AdminRouter");

const EventRouter =
  require("./src/router/EventRouter");

const ProfileRouter =
  require("./src/router/ProfileRouter");

const ContactRouter =
  require("./src/router/ContactRouter");

const OrganizereqRouter =
  require("./src/router/OrganizereqRouter");

const BookTicketRouter =
  require("./src/router/BookTicketRouter");


// =====================================================
// APP
// =====================================================

const app = express();


// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "https://event-user-one.vercel.app",
  "https://eventuser-two.vercel.app",
  "https://event-admin-one.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];


app.use(
  cors({

    origin: function (
      origin,
      callback
    ) {

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
// UPLOADS
// =====================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
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
      "MongoDB connected successfully"
    );

  }

  catch (error) {

    console.error(
      "MongoDB connection error:",
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

    }

    catch (error) {

      console.error(
        "DATABASE ERROR:",
        error.message
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            "Database connection failed",

        });

    }

  }
);


// =====================================================
// ROUTES
// =====================================================

app.use(
  "/signup",
  SignupRouter
);


app.use(
  "/login",
  LoginRouter
);


app.use(
  "/loginhistory",
  LoginHistoryRouter
);


app.use(
  "/admin",
  AdminRouter
);


app.use(
  "/events",
  EventRouter
);


app.use(
  "/profile",
  ProfileRouter
);


app.use(
  "/contact",
  ContactRouter
);


app.use(
  "/organizer-requests",
  OrganizereqRouter
);


app.use(
  "/booking",
  BookTicketRouter
);


// =====================================================
// ROOT TEST
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "Event Management Backend is running.",

    });

  }
);


// =====================================================
// TEST ROUTE
// =====================================================

app.get(
  "/test",
  (req, res) => {

    res.status(200).json({

      success: true,

      message:
        "User backend is working",

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
    process.env.PORT || 2005;


  app.listen(
    PORT,
    () => {

      console.log(
        `Server running on port ${PORT}`
      );

    }
  );

}


// =====================================================
// EXPORT
// =====================================================

module.exports =
  app;
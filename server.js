
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://event-admin-one.vercel.app",
      "https://eventuser-two.vercel.app"
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ],

    credentials: false
  })
);


app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);


// =====================================================
// EVENT ROUTES
// =====================================================

const eventRoutes =
  require("./src/Router/EventRouter");

app.use(
  "/events",
  eventRoutes
);


// =====================================================
// USER CONTACT ROUTES
// =====================================================

const userContactRoutes =
  require("./src/Router/UserContactRouter");

app.use(
  "/user-contact",
  userContactRoutes
);


// =====================================================
// ORGANIZATION ROUTES
// =====================================================

const organizationRoutes =
  require("./src/Router/OrganizationRouter");

app.use(
  "/organization",
  organizationRoutes
);


// =====================================================
// TEST API
// =====================================================

app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message: "Eventora Admin API is working!"
  });

});


// =====================================================
// DATABASE
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB connected successfully"
    );

  })

  .catch((error) => {

    console.log(
      "MongoDB Error:",
      error.message
    );

  });


// =====================================================
// 404
// =====================================================

app.use((req, res) => {

  res.status(404).json({

    success: false,

    message: "Route not found",

    path: req.originalUrl

  });

});


// =====================================================
// GLOBAL ERROR
// =====================================================

app.use(
  (error, req, res, next) => {

    console.log(
      "GLOBAL ERROR:",
      error
    );

    res.status(500).json({

      success: false,

      message:
        error.message ||
        "Internal server error"

    });

  }
);


// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);


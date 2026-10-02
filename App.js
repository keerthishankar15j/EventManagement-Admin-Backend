
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

// =====================================================
// ROUTERS
// =====================================================

const bookingRoutes = require("./src/Router/BookingRouter");

// Keep your other existing routers here if you have them
// const signupRoutes = require("./src/Router/SignupRouter");
// const contactRoutes = require("./src/Router/ContactRouter");
// const eventRoutes = require("./src/Router/EventRouter");

// =====================================================
// CORS
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://event-user-one.vercel.app",
  "https://event-admin-one.vercel.app",
  "https://eventuser-two.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        "Blocked CORS origin:",
        origin
      );

      return callback(null, false);
    },

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

    credentials: false,
  })
);

// =====================================================
// BODY PARSER
// =====================================================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
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
      "MONGO_URI is missing in Vercel Environment Variables"
    );
  }

  try {

    await mongoose.connect(
      process.env.MONGO_URI
    );

    isConnected = true;

    console.log(
      "MongoDB connected successfully"
    );

  } catch (error) {

    isConnected = false;

    console.error(
      "MongoDB connection failed:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// TEST ROOT
// =====================================================

app.get("/", async (req, res) => {

  try {

    await connectDB();

    return res.status(200).json({
      success: true,
      message: "Eventora User API is working",
      database: "Connected",
    });

  } catch (error) {

    console.error(
      "ROOT ERROR:",
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
// BOOKING ROUTES
// =====================================================

app.use(
  "/booking",
  async (req, res, next) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      console.error(
        "BOOKING DATABASE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });
    }
  }
);

app.use(
  "/booking",
  bookingRoutes
);

// =====================================================
// 404
// =====================================================

app.use(
  (req, res) => {

    return res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  }
);

// =====================================================
// GLOBAL ERROR
// =====================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "GLOBAL ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
);

// =====================================================
// VERCEL
// =====================================================

module.exports = app;
```

### And use this `BookingRouter.js`

```js
const express = require("express");

const BookingModel = require("../Model/BookingModel");

const router = express.Router();

// =====================================================
// GET ALL BOOKINGS
// =====================================================

router.get(
  "/getbookings",
  async (req, res) => {

    try {

      console.log(
        "GET /booking/getbookings called"
      );

      const bookings =
        await BookingModel
          .find({})
          .sort({
            createdAt: -1,
          })
          .lean();

      console.log(
        "Bookings found:",
        bookings.length
      );

      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings: bookings,
      });

    } catch (error) {

      console.error(
        "BOOKING FETCH ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch bookings",
        error: error.message,
      });
    }
  }
);

module.exports = router;


const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

// =====================================================
// ROUTERS
// =====================================================

const eventRoutes = require("./src/Router/EventRouter");
const loginActivityRoutes = require("./src/Router/UserActivityRouter");
const userContactRoutes = require("./src/Router/UserContactRouter");
const OrganizationRouter = require("./src/Router/OrganizationRouter");
const bookingRoutes = require("./src/Router/BookingRouter");

// =====================================================
// CORS CONFIGURATION
// =====================================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",

  // USER FRONTEND
  "https://event-user-one.vercel.app",

  // ADMIN FRONTEND
  "https://event-admin-one.vercel.app",

  // OLD USER FRONTEND
  "https://eventuser-two.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {

      // Allow requests without an Origin
      // Example: Postman / direct browser request
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

let isConnected = false;

const connectDB = async () => {
  try {

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
      "MongoDB connected successfully"
    );

  } catch (error) {

    isConnected = false;

    console.error(
      "MongoDB connection error:",
      error.message
    );

    throw error;
  }
};

// =====================================================
// STATIC UPLOADS
// =====================================================

const uploadFolder = path.join(
  __dirname,
  "uploads"
);

app.use(
  "/uploads",
  express.static(uploadFolder)
);

// =====================================================
// ROOT ROUTE
// =====================================================

app.get("/", async (req, res) => {

  try {

    await connectDB();

    return res.status(200).json({
      success: true,
      message: "Eventora User API is working!",
      database: "Connected",
    });

  } catch (error) {

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
// EVENT ROUTES
// =====================================================

app.use(
  "/events",
  async (req, res, next) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });
    }
  }
);

app.use(
  "/events",
  eventRoutes
);

// =====================================================
// LOGIN ACTIVITY
// =====================================================

app.use(
  "/login-activity",
  async (req, res, next) => {

    try {

      await connectDB();

      next();

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: "Database connection failed",
        error: error.message,
      });
    }
  }
);

app.use(
  "/login-activity",
  loginActivityRoutes
);

// =====================================================
// USER CONTACT
// =====================================================

app.use(
  "/user-contact",
  userContactRoutes
);

// =====================================================
// ORGANIZER REQUESTS
// =====================================================

app.use(
  "/organization",
  OrganizationRouter
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
// GLOBAL ERROR HANDLER
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

---

## 2. User Backend `BookingRouter.js`

Your `BookingRouter.js` should have the route **`/getbookings`**.

Use this structure:

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

      const bookings =
        await BookingModel.find()
          .sort({
            createdAt: -1,
          });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings: bookings,
      });

    } catch (error) {

      console.error(
        "GET BOOKINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to get bookings",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET SINGLE BOOKING
// =====================================================

router.get(
  "/getbooking/:id",
  async (req, res) => {

    try {

      const booking =
        await BookingModel.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      return res.status(200).json({
        success: true,
        booking: booking,
      });

    } catch (error) {

      console.error(
        "GET SINGLE BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to get booking",
        error: error.message,
      });
    }
  }
);

module.exports = router;

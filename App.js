const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const eventRoutes = require("./src/Router/EventRouter");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "http://localhost:5173",
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

const uploadFolder = path.join(
  __dirname,
  "uploads"
);

console.log(
  "SERVING UPLOADS FROM:",
  uploadFolder
);

app.use(
  "/uploads",
  express.static(uploadFolder)
);

// =====================================================
// ROUTES
// =====================================================

app.use(
  "/events",
  eventRoutes
);

// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(
    "mongodb://127.0.0.1:27017/eventmanagement"
  )
  .then(() => {

    console.log(
      "MongoDB connected"
    );

    app.listen(9000, () => {

      console.log(
        "Server running on port 9000"
      );

    });

  })
  .catch((error) => {

    console.log(
      "MongoDB connection error:",
      error
    );

  });
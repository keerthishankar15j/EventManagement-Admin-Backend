const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: true,
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
// ROOT TEST
// =====================================================

app.get("/", (req, res) => {
  console.log("ROOT API CALLED");

  return res.status(200).json({
    success: true,
    message: "Eventora Admin API is working!",
  });
});

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/test", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Test route working!",
  });
});

// =====================================================
// 404
// =====================================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// EXPORT
// =====================================================

module.exports = app;
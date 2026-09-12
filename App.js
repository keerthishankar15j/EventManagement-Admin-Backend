const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();


// =====================================================
// ROUTES
// =====================================================

const adminUserRoutes =
  require("./src/Router/adminUserRoutes");

const adminLoginRoutes =
  require("./src/Router/adminLoginRoutes");


const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)

  .then(() => {

    console.log(
      "MongoDB connected"
    );

  })

  .catch((error) => {

    console.error(
      "MongoDB connection error:",
      error
    );

  });


// =====================================================
// ADMIN USER ROUTES
// =====================================================

app.use(
  "/api/admin",
  adminUserRoutes
);


// =====================================================
// ADMIN LOGIN HISTORY
// =====================================================

app.use(
  "/api/admin",
  adminLoginRoutes
);


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {

  res.send(
    "Admin Backend Running"
  );

});


// =====================================================
// SERVER
// =====================================================

const PORT = 9000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});
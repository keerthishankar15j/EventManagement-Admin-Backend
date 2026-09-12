const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const adminLoginRoutes = require("./routes/adminLoginRoutes");

const app = express();

app.use(cors());
app.use(express.json());


/* ================================
   MONGODB
================================ */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.error("MongoDB Error:", error);
  });


/* ================================
   ADMIN LOGIN HISTORY ROUTE
================================ */

app.use(
  "/api/admin",
  adminLoginRoutes
);


/* ================================
   TEST ROUTE
================================ */

app.get("/", (req, res) => {
  res.send("Admin Backend Running");
});


/* ================================
   SERVER
================================ */

const PORT = 9001;

app.listen(PORT, () => {
  console.log(`Admin Server running on port ${PORT}`);
});
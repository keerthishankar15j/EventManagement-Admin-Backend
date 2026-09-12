const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const adminUserRoutes = require("./routes/adminUserRoutes");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((error) => {
    console.log("MongoDB Error:", error);
  });

app.use("/api/admin", adminUserRoutes);

app.get("/", (req, res) => {
  res.send("Admin Backend Running");
});

const PORT = process.env.PORT || 9001;

app.listen(PORT, () => {
  console.log(`Admin Server running on port ${PORT}`);
});
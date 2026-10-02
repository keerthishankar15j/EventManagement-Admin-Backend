const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

app.use(express.json());

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

  await mongoose.connect(process.env.MONGO_URI);

  isConnected = true;

  console.log("MongoDB connected successfully");
};

app.get("/", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      message: "Eventora Admin API is working!",
      database: "Connected",
    });
  } catch (error) {
    console.error("ROOT ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

module.exports = app;
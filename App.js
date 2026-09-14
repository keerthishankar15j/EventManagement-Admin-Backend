const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const AdminUserRouter = require("./src/Router/AdminUserRouter");
const LoginHistoryRouter = require("./src/Router/LoginHistoryRouter");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://event-admin-one.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};
connectDB();

app.use("/admin", AdminUserRouter);
app.use("/admin/login-history", LoginHistoryRouter);

app.get("/", (req, res) => res.send("Admin Backend is running"));

if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
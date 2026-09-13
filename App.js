const express = require("express");
const cors = require("cors");

const app = express();

const userRoutes = require("./src/Router/UserRouter");
const eventRoutes = require("./src/Router/EventRouter");
const loginHistoryRoutes = require("./src/Router/LoginHistoryRoute");

app.use(
  cors({
    origin: "https://event-admin-one.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/login", userRoutes);
app.use("/events", eventRoutes);
app.use("/loginhistory", loginHistoryRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Event Management API is running",
  });
});

module.exports = app;
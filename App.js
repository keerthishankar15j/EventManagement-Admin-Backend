const express = require("express");
const cors = require("cors");

const app = express();

const userRoutes = require("./src/Router/UserRouter");
const eventRoutes = require("./src/Router/EventRouter");
const loginHistoryRoutes =
  require("./src/Router/LoginHistory Route");


// ===============================
// CORS
// ===============================
app.use(
  cors({
    origin: [
      "https://event-admin-one.vercel.app",
    ],
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
    credentials: true,
  })
);


// ===============================
// BODY PARSER
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ===============================
// ROUTES
// ===============================
app.use("/login", userRoutes);

app.use("/events", eventRoutes);

app.use("/loginhistory", loginHistoryRoutes);


// ===============================
// TEST
// ===============================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Event Management API is running",
  });
});


module.exports = app;
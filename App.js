const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  console.log("ADMIN API ROOT CALLED");

  res.status(200).json({
    success: true,
    message: "Eventora Admin API is working!",
  });
});

module.exports = app;
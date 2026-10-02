const express = require("express");

const router = express.Router();

router.get("/getbookings", (req, res) => {
  console.log("BOOKING ROUTE WORKING");

  return res.status(200).json({
    success: true,
    message: "Booking route is working!",
    bookings: [],
  });
});

module.exports = router;
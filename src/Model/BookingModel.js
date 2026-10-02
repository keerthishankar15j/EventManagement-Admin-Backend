const express = require("express");

const BookTicketModel = require("../Model/BookTicketModel");

const router = express.Router();

// =====================================================
// GET ALL BOOKED TICKETS
// =====================================================

router.get("/getbookings", async (req, res) => {
  try {
    console.log("GET /bookings/getbookings called");

    const bookings = await BookTicketModel
      .find({})
      .sort({
        createdAt: -1,
      })
      .lean();

    console.log(
      "Bookings found:",
      bookings.length
    );

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings: bookings,
    });
  } catch (error) {
    console.error(
      "BOOKING FETCH ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
});

module.exports = router;
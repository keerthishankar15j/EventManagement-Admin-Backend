const express = require("express");

const AdminBookingModel = require(
  "../Model/AdminBookingModel"
);

const router = express.Router();

// =====================================================
// GET ALL BOOKINGS
// =====================================================

router.get(
  "/getbookings",
  async (req, res) => {
    try {
      console.log(
        "GET /bookings/getbookings called"
      );

      const bookings =
        await AdminBookingModel
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
  }
);

// =====================================================
// GET SINGLE BOOKING
// =====================================================

router.get(
  "/getbooking/:id",
  async (req, res) => {
    try {

      const booking =
        await AdminBookingModel.findById(
          req.params.id
        );

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      return res.status(200).json({
        success: true,
        booking: booking,
      });

    } catch (error) {

      console.error(
        "SINGLE BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message: "Failed to fetch booking",
        error: error.message,
      });
    }
  }
);

// =====================================================
// STORE BOOKING IN ADMIN DATABASE
// =====================================================

router.post(
  "/store",
  async (req, res) => {
    try {

      const bookingData = req.body;

      const existingBooking =
        await AdminBookingModel.findOne({
          userEmail:
            bookingData.userEmail,

          eventId:
            bookingData.eventId,

          bookingDate:
            bookingData.bookingDate,
        });

      if (existingBooking) {
        return res.status(200).json({
          success: true,
          message:
            "Booking already exists",
          booking: existingBooking,
        });
      }

      const booking =
        await AdminBookingModel.create(
          bookingData
        );

      return res.status(201).json({
        success: true,
        message:
          "Booking stored successfully",
        booking: booking,
      });

    } catch (error) {

      console.error(
        "BOOKING STORE ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to store booking",
        error: error.message,
      });
    }
  }
);

module.exports = router;
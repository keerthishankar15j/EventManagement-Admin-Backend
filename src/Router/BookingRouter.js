const express = require("express");

const AdminBookingModel = require(
  "../Model/AdminBookingModel"
);

const router = express.Router();

// =====================================================
// TEST BOOKING ROUTE
// =====================================================

router.get(
  "/test",
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: "Booking route is working!",
    });
  }
);

// =====================================================
// GET ALL BOOKINGS
// =====================================================

router.get(
  "/getbookings",
  async (req, res) => {
    try {

      console.log(
        "GET /bookings/getbookings"
      );

      const bookings =
        await AdminBookingModel
          .find({})
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings: bookings,
      });

    } catch (error) {

      console.error(
        "GET BOOKINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch bookings",
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
        "GET SINGLE BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch booking",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET CONFIRMED BOOKINGS
// =====================================================

router.get(
  "/confirmed",
  async (req, res) => {
    try {

      const bookings =
        await AdminBookingModel
          .find({
            status: "Confirmed",
          })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings: bookings,
      });

    } catch (error) {

      console.error(
        "CONFIRMED BOOKINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch confirmed bookings",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET CANCELLED BOOKINGS
// =====================================================

router.get(
  "/cancelled",
  async (req, res) => {
    try {

      const bookings =
        await AdminBookingModel
          .find({
            status: "Cancelled",
          })
          .sort({
            createdAt: -1,
          })
          .lean();

      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings: bookings,
      });

    } catch (error) {

      console.error(
        "CANCELLED BOOKINGS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to fetch cancelled bookings",
        error: error.message,
      });
    }
  }
);

// =====================================================
// STORE BOOKING
// =====================================================

router.post(
  "/store",
  async (req, res) => {
    try {

      const bookingData = req.body;

      console.log(
        "STORE BOOKING:",
        bookingData
      );

      // -----------------------------------------------
      // VALIDATION
      // -----------------------------------------------

      if (
        !bookingData.userName ||
        !bookingData.userEmail ||
        !bookingData.eventName ||
        !bookingData.numberOfTickets
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Required booking details are missing",
        });
      }

      // -----------------------------------------------
      // STORE BOOKING
      // -----------------------------------------------

      const booking =
        await AdminBookingModel.create(
          bookingData
        );

      console.log(
        "Booking stored successfully:",
        booking._id
      );

      return res.status(201).json({
        success: true,
        message:
          "Booking stored successfully",
        booking: booking,
      });

    } catch (error) {

      console.error(
        "STORE BOOKING ERROR:",
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

// =====================================================
// UPDATE BOOKING STATUS
// =====================================================

router.patch(
  "/status/:id",
  async (req, res) => {
    try {

      const { status } = req.body;

      if (
        ![
          "Confirmed",
          "Cancelled",
        ].includes(status)
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Status must be Confirmed or Cancelled",
        });
      }

      const booking =
        await AdminBookingModel.findByIdAndUpdate(
          req.params.id,

          {
            status: status,
          },

          {
            new: true,
            runValidators: true,
          }
        );

      if (!booking) {

        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      return res.status(200).json({
        success: true,
        message:
          "Booking status updated successfully",
        booking: booking,
      });

    } catch (error) {

      console.error(
        "UPDATE BOOKING STATUS ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to update booking status",
        error: error.message,
      });
    }
  }
);

// =====================================================
// DELETE BOOKING
// =====================================================

router.delete(
  "/delete/:id",
  async (req, res) => {
    try {

      const booking =
        await AdminBookingModel.findByIdAndDelete(
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
        message:
          "Booking deleted successfully",
      });

    } catch (error) {

      console.error(
        "DELETE BOOKING ERROR:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Failed to delete booking",
        error: error.message,
      });
    }
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;
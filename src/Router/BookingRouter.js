
const express = require("express");
const axios = require("axios");
const nodemailer = require("nodemailer");

const BookingModel = require("../Model/BookingModel");

const router = express.Router();

// =====================================================
// USER BOOKING API
// =====================================================

const USER_BOOKING_API =
  "https://user-api-iota-six.vercel.app/booking/getbookings";

// =====================================================
// EMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// =====================================================
// EMAIL FUNCTION
// =====================================================

async function sendBookingConfirmationEmail({
  email,
  name,
  eventName,
  eventDate,
  eventTime,
  location,
  quantity,
  totalAmount,
}) {
  const mailOptions = {
    from: `"Eventora" <${process.env.EMAIL_USER}>`,

    to: email,

    subject:
      "Eventora - Booking Confirmed Successfully",

    html: `
      <div
        style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: auto;
          padding: 30px;
          background: #f5f5f5;
        "
      >

        <div
          style="
            background: #111827;
            color: white;
            padding: 25px;
            border-radius: 15px 15px 0 0;
            text-align: center;
          "
        >

          <h1 style="margin: 0;">
            🎉 Eventora
          </h1>

          <p style="margin-top: 10px;">
            Booking Confirmation
          </p>

        </div>

        <div
          style="
            background: white;
            padding: 30px;
            border-radius: 0 0 15px 15px;
          "
        >

          <h2>
            Hello ${name || "User"} 👋
          </h2>

          <p>
            Your event booking has been
            <strong>successfully confirmed!</strong>
          </p>

          <hr />

          <h3>
            Event Details
          </h3>

          <p>
            <strong>Event:</strong>
            ${eventName || "Event"}
          </p>

          <p>
            <strong>Date:</strong>
            ${eventDate || "-"}
          </p>

          <p>
            <strong>Time:</strong>
            ${eventTime || "-"}
          </p>

          <p>
            <strong>Location:</strong>
            ${location || "-"}
          </p>

          <p>
            <strong>Tickets:</strong>
            ${quantity || 0}
          </p>

          <p>
            <strong>Total Amount:</strong>
            ₹${totalAmount || 0}
          </p>

          <hr />

          <p>
            Thank you for booking with
            <strong>Eventora</strong>.
          </p>

          <p>
            We look forward to seeing you at the event! 🎊
          </p>

        </div>

      </div>
    `,
  };

  await transporter.sendMail(
    mailOptions
  );
}

// =====================================================
// SYNC BOOKINGS FROM USER API
// =====================================================

router.get("/sync", async (req, res) => {
  try {
    console.log(
      "===================================="
    );

    console.log(
      "FETCHING BOOKINGS FROM USER API..."
    );

    console.log(
      "USER BOOKING API:",
      USER_BOOKING_API
    );

    console.log(
      "===================================="
    );

    // -----------------------------------------------
    // GET BOOKINGS FROM USER BACKEND
    // -----------------------------------------------

    const response = await axios.get(
      USER_BOOKING_API,
      {
        timeout: 15000,
      }
    );

    console.log(
      "USER API RESPONSE:",
      JSON.stringify(
        response.data,
        null,
        2
      )
    );

    // -----------------------------------------------
    // GET BOOKINGS ARRAY
    // -----------------------------------------------

    let bookings = [];

    if (
      response.data &&
      Array.isArray(
        response.data.bookings
      )
    ) {
      bookings =
        response.data.bookings;
    } else if (
      response.data &&
      Array.isArray(
        response.data.data
      )
    ) {
      bookings =
        response.data.data;
    } else if (
      Array.isArray(response.data)
    ) {
      bookings =
        response.data;
    }

    console.log(
      "TOTAL USER BOOKINGS:",
      bookings.length
    );

    // -----------------------------------------------
    // NO BOOKINGS
    // -----------------------------------------------

    if (bookings.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "No bookings found in user API",
        count: 0,
        data: [],
      });
    }

    // -----------------------------------------------
    // SAVE BOOKINGS
    // -----------------------------------------------

    const savedBookings = [];

    for (
      const booking of bookings
    ) {

      // =============================================
      // BOOKING ID
      // =============================================

      const bookingId =
        booking._id ||
        booking.bookingId ||
        booking.id;

      if (!bookingId) {
        console.log(
          "Skipping booking: Booking ID missing",
          booking
        );

        continue;
      }

      // =============================================
      // USER DETAILS
      // =============================================

      const name =
        booking.userName ||
        booking.name ||
        booking.username ||
        booking.user?.name ||
        "";

      const email =
        booking.userEmail ||
        booking.email ||
        booking.user?.email ||
        "";

      const phone =
        booking.phone ||
        booking.mobile ||
        booking.phoneNumber ||
        booking.user?.phone ||
        "";

      // =============================================
      // EVENT DETAILS
      // =============================================

      const eventId =
        booking.eventId ||
        booking.event?._id ||
        booking.event?.id ||
        "";

      const eventName =
        booking.eventName ||
        booking.event?.name ||
        booking.event?.eventName ||
        booking.event?.title ||
        booking.nameOfEvent ||
        "";

      const eventDate =
        booking.eventDate ||
        booking.event?.date ||
        booking.date ||
        "";

      const eventTime =
        booking.eventTime ||
        booking.event?.time ||
        booking.time ||
        "";

      const location =
        booking.location ||
        booking.event?.location ||
        booking.event?.venue ||
        "";

      // =============================================
      // PRICE
      // =============================================

      const ticketPrice = Number(
        booking.ticketPrice ||
        booking.event?.ticketPrice ||
        booking.price ||
        booking.amount ||
        0
      );

      const quantity = Number(
        booking.numberOfTickets ||
        booking.quantity ||
        booking.ticketQuantity ||
        booking.tickets ||
        1
      );

      const totalAmount = Number(
        booking.totalAmount ??
        booking.totalPrice ??
        booking.total ??
        ticketPrice * quantity
      );

      // =============================================
      // STATUS
      // =============================================

      const bookingStatus =
        booking.bookingStatus ||
        booking.status ||
        "Confirmed";

      // =============================================
      // CHECK EXISTING BOOKING
      // =============================================

      const existingBooking =
        await BookingModel.findOne({
          bookingId: String(
            bookingId
          ),
        });

      // =============================================
      // SAVE / UPDATE BOOKING
      // =============================================

      const savedBooking =
        await BookingModel.findOneAndUpdate(
          {
            bookingId: String(
              bookingId
            ),
          },

          {
            bookingId: String(
              bookingId
            ),

            name,

            email,

            phone,

            eventId: String(
              eventId
            ),

            eventName,

            eventDate,

            eventTime,

            location,

            ticketPrice,

            quantity,

            totalAmount,

            bookingStatus,

            bookingDate:
              booking.bookingDate ||
              booking.createdAt ||
              new Date(),

            originalBookingData:
              booking,
          },

          {
            new: true,

            upsert: true,

            setDefaultsOnInsert: true,
          }
        );

      savedBookings.push(
        savedBooking
      );

      // =============================================
      // EMAIL ONLY FOR NEW BOOKING
      // =============================================

      if (
        !existingBooking &&
        email
      ) {
        try {

          await sendBookingConfirmationEmail(
            {
              email,

              name,

              eventName,

              eventDate,

              eventTime,

              location,

              quantity,

              totalAmount,
            }
          );

          console.log(
            "Booking confirmation email sent:",
            email
          );

        } catch (
          emailError
        ) {

          console.error(
            "Email sending failed:",
            emailError.message
          );

        }
      }
    }

    // -----------------------------------------------
    // SUCCESS
    // -----------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Bookings synced successfully",

      count:
        savedBookings.length,

      data: savedBookings,
    });

  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "BOOKING SYNC ERROR"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    console.error(
      "===================================="
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to sync bookings",

      error:
        error.response?.data ||
        error.message,
    });
  }
});

// =====================================================
// GET STORED BOOKINGS
// =====================================================

router.get(
  "/getbookings",
  async (req, res) => {

    try {

      const bookings =
        await BookingModel.find()
          .sort({
            bookingDate: -1,
          });

      return res.status(200).json({

        success: true,

        count:
          bookings.length,

        data:
          bookings,

      });

    } catch (error) {

      console.error(
        "GET BOOKINGS ERROR:",
        error.message
      );

      return res.status(500).json({

        success: false,

        message:
          "Failed to get bookings",

        error:
          error.message,

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
        await BookingModel.findById(
          req.params.id
        );

      if (!booking) {

        return res.status(404).json({

          success: false,

          message:
            "Booking not found",

        });
      }

      return res.status(200).json({

        success: true,

        data:
          booking,

      });

    } catch (error) {

      return res.status(500).json({

        success: false,

        message:
          "Failed to get booking",

        error:
          error.message,

      });
    }
  }
);

module.exports = router;


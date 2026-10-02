const express = require("express");
const axios = require("axios");

const BookingModel = require("../Model/BookingModel");

const router = express.Router();

// =====================================================
// USER BOOKING API
// =====================================================

const USER_BOOKING_API =
  "https://user-api-iota-six.vercel.app/booking/getbookings";

// =====================================================
// GET BOOKINGS FROM USER API
// =====================================================

router.get("/sync", async (req, res) => {
  try {
    console.log("Fetching bookings from user API...");

    const response = await axios.get(USER_BOOKING_API);

    console.log(
      "USER BOOKING API RESPONSE:",
      JSON.stringify(response.data, null, 2)
    );

    let bookings = [];

    // -----------------------------------------------
    // Handle different response formats
    // -----------------------------------------------

    if (Array.isArray(response.data)) {
      bookings = response.data;
    } else if (Array.isArray(response.data.data)) {
      bookings = response.data.data;
    } else if (Array.isArray(response.data.bookings)) {
      bookings = response.data.bookings;
    } else if (
      response.data.data &&
      Array.isArray(response.data.data.bookings)
    ) {
      bookings = response.data.data.bookings;
    }

    console.log("TOTAL BOOKINGS:", bookings.length);

    const savedBookings = [];

    for (const booking of bookings) {
      // =================================================
      // BOOKING ID
      // =================================================

      const bookingId =
        booking._id ||
        booking.bookingId ||
        booking.id;

      if (!bookingId) {
        console.log(
          "Skipping booking because ID is missing:",
          booking
        );

        continue;
      }

      // =================================================
      // USER DETAILS
      // =================================================

      const name =
        booking.name ||
        booking.userName ||
        booking.username ||
        booking.user?.name ||
        booking.user?.username ||
        "";

      const email =
        booking.email ||
        booking.userEmail ||
        booking.user?.email ||
        booking.account?.email ||
        "";

      const phone =
        booking.phone ||
        booking.mobile ||
        booking.phoneNumber ||
        booking.user?.phone ||
        "";

      // =================================================
      // EVENT DETAILS
      // =================================================

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

      // =================================================
      // PRICE
      // =================================================

      const ticketPrice = Number(
        booking.ticketPrice ||
          booking.event?.ticketPrice ||
          booking.price ||
          booking.amount ||
          0
      );

      const quantity = Number(
        booking.quantity ||
          booking.ticketQuantity ||
          booking.tickets ||
          1
      );

      const totalAmount = Number(
        booking.totalAmount ||
          booking.totalPrice ||
          booking.total ||
          ticketPrice * quantity ||
          0
      );

      // =================================================
      // STATUS
      // =================================================

      const bookingStatus =
        booking.bookingStatus ||
        booking.status ||
        "Confirmed";

      // =================================================
      // CHECK WHETHER BOOKING ALREADY EXISTS
      // =================================================

      const existingBooking =
        await BookingModel.findOne({
          bookingId: String(bookingId),
        });

      // =================================================
      // SAVE / UPDATE
      // =================================================

      const savedBooking =
        await BookingModel.findOneAndUpdate(
          {
            bookingId: String(bookingId),
          },
          {
            bookingId: String(bookingId),

            name,
            email,
            phone,

            eventId: String(eventId),
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

            originalBookingData: booking,
          },
          {
            new: true,
            upsert: true,
          }
        );

      savedBookings.push(savedBooking);

      // =================================================
      // SEND EMAIL ONLY FOR NEW BOOKING
      // =================================================

      if (!existingBooking && email) {
        console.log(
          "New booking found. Email:",
          email
        );

        // Email function will be added below
        try {
          await sendBookingConfirmationEmail({
            email,
            name,
            eventName,
            eventDate,
            eventTime,
            location,
            quantity,
            totalAmount,
          });

          console.log(
            "Booking confirmation email sent:",
            email
          );
        } catch (emailError) {
          console.error(
            "Email sending failed:",
            emailError.message
          );
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: "Bookings synced successfully",
      count: savedBookings.length,
      data: savedBookings,
    });
  } catch (error) {
    console.error(
      "BOOKING SYNC ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to sync bookings",
      error:
        error.response?.data ||
        error.message,
    });
  }
});

// =====================================================
// GET STORED BOOKINGS
// =====================================================

router.get("/getbookings", async (req, res) => {
  try {
    const bookings =
      await BookingModel.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(
      "GET BOOKINGS ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get bookings",
      error: error.message,
    });
  }
});

// =====================================================
// GET SINGLE BOOKING
// =====================================================

router.get("/getbooking/:id", async (req, res) => {
  try {
    const booking =
      await BookingModel.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to get booking",
      error: error.message,
    });
  }
});


// =====================================================
// EMAIL FUNCTION
// =====================================================

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

    subject: "Eventora - Booking Confirmed Successfully",

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

          <h3>Event Details</h3>

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
            ${quantity}
          </p>

          <p>
            <strong>Total Amount:</strong>
            ₹${totalAmount}
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

  await transporter.sendMail(mailOptions);
}

module.exports = router;
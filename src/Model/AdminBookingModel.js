const mongoose = require("mongoose");

// =====================================================
// ATTENDEE SCHEMA
// =====================================================

const AttendeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

// =====================================================
// ADMIN BOOKING SCHEMA
// =====================================================

const AdminBookingSchema = new mongoose.Schema(
  {
    // =================================================
    // USER BOOKING ID
    // =================================================
    // This is the _id coming from User Backend booking.
    // Used to prevent duplicate bookings in Admin DB.
    // =================================================

    sourceBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },

    // =================================================
    // USER DETAILS
    // =================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // =================================================
    // EVENT DETAILS
    // =================================================

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },

    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    eventDate: {
      type: Date,
      required: false,
    },

    eventTime: {
      type: String,
      default: "",
      trim: true,
    },

    eventLocation: {
      type: String,
      default: "",
      trim: true,
    },

    eventCategory: {
      type: String,
      default: "Event",
      trim: true,
    },

    // =================================================
    // EVENT IMAGE
    // =================================================

    eventImage: {
      type: String,
      default: "",
      trim: true,
    },

    // =================================================
    // TICKET DETAILS
    // =================================================

    ticketPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    numberOfTickets: {
      type: Number,
      required: true,
      min: 1,
      max: 4,
    },

    // =================================================
    // ATTENDEES
    // =================================================

    attendees: {
      type: [AttendeeSchema],
      default: [],
    },

    // =================================================
    // TOTAL AMOUNT
    // =================================================

    totalAmount: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    // =================================================
    // BOOKING DATE
    // =================================================

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    // =================================================
    // STATUS
    // =================================================

    status: {
      type: String,

      enum: [
        "Confirmed",
        "Cancelled",
      ],

      default: "Confirmed",
    },

    // =================================================
    // EMAIL STATUS
    // =================================================

    emailSent: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

// =====================================================
// EXPORT
// =====================================================

module.exports =
  mongoose.models.AdminBooking ||
  mongoose.model(
    "AdminBooking",
    AdminBookingSchema
  );
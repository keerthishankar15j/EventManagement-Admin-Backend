const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // Original booking ID from user backend
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    // User details
    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    // Event details
    eventId: {
      type: String,
      default: "",
    },

    eventName: {
      type: String,
      default: "",
    },

    eventDate: {
      type: String,
      default: "",
    },

    eventTime: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    ticketPrice: {
      type: Number,
      default: 0,
    },

    quantity: {
      type: Number,
      default: 1,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    bookingStatus: {
      type: String,
      default: "Confirmed",
    },

    bookingDate: {
      type: Date,
      default: Date.now,
    },

    // Keep complete original booking data
    originalBookingData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const BookingModel = mongoose.model(
  "AdminBooking",
  bookingSchema
);

module.exports = BookingModel;
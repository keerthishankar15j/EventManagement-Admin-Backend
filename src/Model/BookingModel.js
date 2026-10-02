const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

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

    originalBookingData: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model(
    "Booking",
    BookingSchema
  );
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    // =================================================
    // EVENT NAME
    // =================================================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // ORGANIZER
    // =================================================

    organizer: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // DATE
    // =================================================

    date: {
      type: String,
      required: true,
    },

    // =================================================
    // TIME
    // =================================================

    time: {
      type: String,
      required: true,
    },

    // =================================================
    // LOCATION
    // =================================================

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // DESCRIPTION
    // =================================================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // =================================================
    // CATEGORY
    // =================================================

    category: {
      type: String,
      required: true,
      enum: [
        "Music",
        "Conferences",
        "Workshop",
        "Sports",
        "Technology",
        "Education",
        "Entertainment",
        "Other",
      ],
    },

    // =================================================
    // NUMBER OF TICKETS
    // =================================================

    tickets: {
      type: Number,
      required: true,
      min: 1,
    },

    // =================================================
    // TICKET PRICE
    // =================================================

    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // =================================================
    // IMAGE
    // =================================================

    image: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

// Prevent model overwrite error
const Event =
  mongoose.models.Event ||
  mongoose.model("Event", eventSchema);

module.exports = Event;
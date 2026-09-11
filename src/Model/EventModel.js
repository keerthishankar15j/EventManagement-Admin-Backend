const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    organizer: {
      type: String,
      required: true,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

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

    tickets: {
      type: Number,
      required: true,
      min: 1,
    },

    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const eventModel = mongoose.model("Event", eventSchema);

module.exports = eventModel;
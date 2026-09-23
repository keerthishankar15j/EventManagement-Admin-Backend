const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    organizationName: {
      type: String,
      required: true,
      trim: true,
    },

    organizationType: {
      type: String,
      required: true,
    },

    eventName: {
      type: String,
      required: true,
    },

    eventDate: {
      type: String,
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    numberOfPeople: {
      type: Number,
      required: true,
    },

    requirements: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["Pending", "Replied"],
      default: "Pending",
    },

    adminReply: {
      type: String,
      default: "",
    },

    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "OrganizationRequest",
  OrganizationSchema
);
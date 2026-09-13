const mongoose = require("mongoose");

const loginHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    loginTime: {
      type: Date,
      required: true,
      default: Date.now,
    },

    logoutTime: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Logged Out"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.LoginHistory ||
  mongoose.model(
    "LoginHistory",
    loginHistorySchema
  );

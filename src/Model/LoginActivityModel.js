const mongoose = require("mongoose");

const LoginActivitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
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

module.exports = mongoose.model(
  "LoginActivity",
  LoginActivitySchema
);
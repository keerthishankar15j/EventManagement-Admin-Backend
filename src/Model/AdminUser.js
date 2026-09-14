const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema(
  {
    sourceUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
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

    bio: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      default: "user",
    },

    status: {
      type: String,
      enum: [
        "Online",
        "Offline",
        "Logged Out",
      ],
      default: "Offline",
    },

    source: {
      type: String,
      default: "user-project",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "AdminUser",
  AdminUserSchema
);
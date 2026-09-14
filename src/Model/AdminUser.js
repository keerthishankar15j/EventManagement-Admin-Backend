const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema(
  {
    sourceUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      default: "user",
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

    joinedAt: {
      type: Date,
      default: null,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    loginStatus: {
      type: String,
      enum: ["online", "offline", "logout"],
      default: "offline",
    },

    loginType: {
      type: String,
      default: "normal",
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
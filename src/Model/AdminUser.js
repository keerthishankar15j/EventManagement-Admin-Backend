const mongoose = require("mongoose");

const AdminUserSchema =
  new mongoose.Schema(
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
        unique: true,
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

      // Online / Offline
      status: {
        type: String,
        enum: ["online", "offline"],
        default: "offline",
      },
    },

    {
      timestamps: true,
    }
  );


module.exports =
  mongoose.model(
    "AdminUser",
    AdminUserSchema
  );
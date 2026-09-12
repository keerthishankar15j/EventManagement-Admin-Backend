const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: String,

    email: String,

    password: String,

    role: String,

    profileImage: String,

    phone: String,

    bio: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
const mongoose = require(
  "mongoose"
);

const SignupSchema =
  new mongoose.Schema(
    {
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

      password: {
        type: String,
        required: true,
      },

      role: {
        type: String,

        enum: [
          "user",
          "admin",
          "organizer",
        ],

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
    },

    {
      timestamps: true,
    }
  );

module.exports =
  mongoose.model(
    "Signup",
    SignupSchema
  );
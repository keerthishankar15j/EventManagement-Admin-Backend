const axios = require("axios");

const LoginActivity = require("../Model/LoginActivityModel");

const {
  sendLoginSuccessEmail,
} = require("../Server/EmailServer");

// =====================================================
// GET USER LOGIN DETAILS
// =====================================================

const getUserLoginDetails = async (req, res) => {
  try {

    // =================================================
    // CHECK FRIEND API URL
    // =================================================

    const apiUrl =
      process.env.FRIEND_LOGIN_API_URL;

    if (!apiUrl) {
      return res.status(500).json({
        success: false,
        message:
          "FRIEND_LOGIN_API_URL is not configured",
      });
    }

    console.log(
      "Calling Friend Login API:",
      apiUrl
    );

    // =================================================
    // GET USERS FROM FRIEND API
    // =================================================

    const response = await axios.get(apiUrl);

    console.log(
      "Friend API response:",
      response.data
    );

    // =================================================
    // GET USERS ARRAY
    // =================================================

    const users =
      response.data?.data?.users ||
      response.data?.users ||
      response.data?.data ||
      response.data ||
      [];

    console.log(
      "Users received:",
      Array.isArray(users)
        ? users.length
        : "Not an array"
    );

    // =================================================
    // CHECK ARRAY
    // =================================================

    if (!Array.isArray(users)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid user data received from friend API",
      });
    }

    // =================================================
    // STORE USERS
    // =================================================

    for (const user of users) {

      const userId =
        user.userId ||
        user._id ||
        user.id;

      if (!userId) {
        console.log(
          "Skipping user - userId missing"
        );

        continue;
      }

      if (!user.email) {
        console.log(
          "Skipping user - email missing"
        );

        continue;
      }

      const existingUser =
        await LoginActivity.findOne({
          userId: String(userId),
        });

      // =================================================
      // CREATE NEW USER
      // =================================================

      if (!existingUser) {

        const newUser =
          await LoginActivity.create({
            userId: String(userId),

            name:
              user.name ||
              "Event User",

            email:
              user.email,

            loginTime:
              user.loginTime ||
              null,

            logoutTime:
              user.logoutTime ||
              null,

            status:
              user.status ||
              "Active",
          });

        console.log(
          "User stored:",
          newUser.email
        );

        // =================================================
        // SEND EMAIL
        // =================================================

        try {

          await sendLoginSuccessEmail(
            newUser.email,
            newUser.name
          );

          console.log(
            "Login success email sent:",
            newUser.email
          );

        } catch (emailError) {

          console.error(
            "Email sending failed:",
            emailError.message
          );

          // Do NOT stop the whole request
          // if email fails.
        }
      }
    }

    // =================================================
    // GET ALL ADMIN USERS
    // =================================================

    const allUsers =
      await LoginActivity.find()
        .sort({
          createdAt: -1,
        });

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,

      message:
        "Users fetched, stored and processed successfully",

      data: {
        count: allUsers.length,
        users: allUsers,
      },
    });

  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "USER ACTIVITY ERROR"
    );

    console.error(
      "===================================="
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "Error name:",
      error.name
    );

    if (error.response) {

      console.error(
        "Friend API status:",
        error.response.status
      );

      console.error(
        "Friend API data:",
        error.response.data
      );
    }

    return res.status(500).json({
      success: false,

      message:
        "Unable to fetch and store user login details",

      error:
        error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getUserLoginDetails,
};
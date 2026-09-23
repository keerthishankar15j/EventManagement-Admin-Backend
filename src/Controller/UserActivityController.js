const axios = require("axios");
const LoginActivity = require("../Model/LoginActivityModel");

const {
  sendLoginSuccessEmail,
} = require("../Server/EmailServer");


// =====================================================
// GET USER LOGIN DETAILS FROM FRIEND'S API
// STORE IN ADMIN DB
// SEND EMAIL AFTER DB STORAGE
// =====================================================

const getUserLoginDetails = async (req, res) => {

  try {

    // =================================================
    // 1. GET USERS FROM FRIEND API
    // =================================================

    const response = await axios.get(
      process.env.FRIEND_LOGIN_API_URL
    );

    console.log(
      "Friend API response:",
      response.data
    );


    // =================================================
    // 2. GET USERS ARRAY
    // =================================================

    const users =
      response.data?.data?.users ||
      response.data?.users ||
      response.data?.data ||
      response.data ||
      [];


    console.log(
      "Users received from friend API:",
      users.length
    );


    // =================================================
    // 3. CHECK ARRAY
    // =================================================

    if (!Array.isArray(users)) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid user data received from friend API",
      });

    }


    // =================================================
    // 4. STORE USERS IN ADMIN DB
    // =================================================

    for (const user of users) {

      // -----------------------------------------------
      // Get user ID
      // -----------------------------------------------

      const userId =
        user.userId ||
        user._id ||
        user.id;


      // -----------------------------------------------
      // Check required fields
      // -----------------------------------------------

      if (!userId) {

        console.log(
          "Skipping user because userId is missing:",
          user
        );

        continue;
      }


      if (!user.email) {

        console.log(
          "Skipping user because email is missing:",
          user
        );

        continue;
      }


      // -----------------------------------------------
      // Check existing user
      // -----------------------------------------------

      const existingUser =
        await LoginActivity.findOne({
          userId: String(userId),
        });


      // -----------------------------------------------
      // Only store new user
      // -----------------------------------------------

      if (!existingUser) {

        const newUser =
          await LoginActivity.create({

            userId: String(userId),

            name:
              user.name ||
              "Event User",

            email:
              user.email,

            status:
              user.status ||
              "Active",

          });


        console.log(
          "User stored in Admin DB:",
          newUser.email
        );


        // =============================================
        // SEND EMAIL AFTER DB STORAGE
        // =============================================

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

          console.log(
            "Email sending failed:",
            emailError.message
          );

        }

      }

    }


    // =================================================
    // 5. GET ALL USERS FROM ADMIN DB
    // =================================================

    const allUsers =
      await LoginActivity.find()
        .sort({
          createdAt: -1,
        });


    // =================================================
    // 6. SEND RESPONSE
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

    console.log(
      "===================================="
    );

    console.log(
      "USER ACTIVITY ERROR"
    );

    console.log(
      "===================================="
    );

    console.log(
      "Error message:",
      error.message
    );


    // -----------------------------------------------
    // Friend API error
    // -----------------------------------------------

    if (error.response) {

      console.log(
        "Friend API status:",
        error.response.status
      );

      console.log(
        "Friend API data:",
        error.response.data
      );

    }


    // -----------------------------------------------
    // Mongo/Mongoose error
    // -----------------------------------------------

    if (error.name) {

      console.log(
        "Error name:",
        error.name
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


module.exports = {
  getUserLoginDetails,
};
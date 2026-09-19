const axios = require("axios");
const LoginActivity = require("../Model/LoginActivityModel");

const {
  sendLoginSuccessEmail,
} = require("../Server/EmailService");


// =====================================================
// GET USER LOGIN DETAILS FROM FRIEND'S API
// STORE IN ADMIN DB
// SEND EMAIL AFTER DB STORAGE
// =====================================================

const getUserLoginDetails = async (req, res) => {

  try {

    // =================================================
    // 1. GET USER DATA FROM FRIEND'S API
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
      response.data.data?.users ||
      response.data.users ||
      response.data.data ||
      [];


    // Make sure users is an array

    if (!Array.isArray(users)) {

      return res.status(400).json({
        success: false,
        message: "Invalid user data received from friend API",
      });

    }


    // =================================================
    // 3. STORE USERS IN ADMIN DB
    // =================================================

    const savedUsers = [];

    for (const user of users) {

      // -----------------------------------------------
      // Check whether user already exists
      // -----------------------------------------------

      const existingUser =
        await LoginActivity.findOne({
          userId: user.userId || user._id || user.id,
        });


      // -----------------------------------------------
      // If user does not exist, create new record
      // -----------------------------------------------

      if (!existingUser) {

        const newUser =
          await LoginActivity.create({

            userId:
              user.userId ||
              user._id ||
              user.id,

            name: user.name,

            email: user.email,

            status:
              user.status || "Active",

          });


        console.log(
          "User stored in Admin DB:",
          newUser.email
        );


        // =================================================
        // 4. SEND EMAIL ONLY AFTER DB STORAGE SUCCESS
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

          console.log(
            "Email sending failed:",
            emailError.message
          );

        }


        savedUsers.push(newUser);

      } else {

        // Existing user
        savedUsers.push(existingUser);

      }

    }


    // =================================================
    // 5. RETURN ADMIN DB DATA TO FRONTEND
    // =================================================

    const allUsers =
      await LoginActivity.find()
        .sort({ createdAt: -1 });


    res.status(200).json({

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
      "User Activity Error:",
      error.message
    );


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


    res.status(500).json({

      success: false,

      message:
        "Unable to fetch and store user login details",

      error: error.message,

    });

  }

};


module.exports = {
  getUserLoginDetails,
};
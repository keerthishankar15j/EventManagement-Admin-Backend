const axios = require("axios");
const mongoose = require("mongoose");

const LoginActivity = require("../Model/LoginActivityModel");

const {
  sendWelcomeEmail,
} = require("../Utils/EmailService");


// =====================================================
// GET USER LOGIN DETAILS FROM FRIEND'S API
// =====================================================

const getUserLoginDetails = async (req, res) => {

  try {

    // =================================================
    // GET USERS FROM FRIEND'S API
    // =================================================

    const response = await axios.get(
      process.env.FRIEND_LOGIN_API_URL
    );

    console.log(
      "Friend API response:",
      response.data
    );


    // =================================================
    // GET USER ARRAY
    // =================================================

    const userList =
      response.data?.data?.users ||
      response.data?.users ||
      response.data?.data ||
      response.data;


    if (!Array.isArray(userList)) {

      return res.status(500).json({
        success: false,
        message: "User data is not an array",
      });

    }


    // =================================================
    // STORE NEW USERS + SEND EMAIL
    // =================================================

    for (const user of userList) {

      // -----------------------------------------------
      // CHECK REQUIRED DATA
      // -----------------------------------------------

      if (
        !user.name ||
        !user.email
      ) {

        console.log(
          "Skipping user because name/email is missing:",
          user
        );

        continue;

      }


      // -----------------------------------------------
      // CHECK IF USER ALREADY EXISTS
      // -----------------------------------------------

      const existingUser =
        await LoginActivity.findOne({
          email: user.email,
        });


      // -----------------------------------------------
      // NEW USER
      // -----------------------------------------------

      if (!existingUser) {

        console.log(
          "NEW USER FOUND:",
          user.email
        );


        // ---------------------------------------------
        // CHECK USER ID
        // ---------------------------------------------

        if (
          !user.userId ||
          !mongoose.Types.ObjectId.isValid(
            user.userId
          )
        ) {

          console.log(
            "Invalid or missing userId:",
            user.userId
          );

          continue;

        }


        // ---------------------------------------------
        // SAVE TO YOUR MONGODB
        // ---------------------------------------------

        const newUser =
          await LoginActivity.create({

            userId: new mongoose.Types.ObjectId(
              user.userId
            ),

            name: user.name,

            email: user.email,

            loginTime:
              user.loginTime
                ? new Date(user.loginTime)
                : new Date(),

            logoutTime:
              user.logoutTime
                ? new Date(user.logoutTime)
                : null,

            status:
              user.status || "Active",

          });


        console.log(
          "USER SAVED TO MONGODB:",
          newUser.email
        );


        // ---------------------------------------------
        // SEND WELCOME EMAIL
        // ---------------------------------------------

        try {

          await sendWelcomeEmail(
            newUser.name,
            newUser.email
          );

          console.log(
            "WELCOME EMAIL SENT:",
            newUser.email
          );

        } catch (emailError) {

          console.error(
            "EMAIL ERROR:",
            emailError.message
          );

        }

      } else {

        console.log(
          "USER ALREADY EXISTS:",
          user.email
        );

      }

    }


    // =================================================
    // GET UPDATED DATA FROM YOUR MONGODB
    // =================================================

    const users =
      await LoginActivity.find()
        .sort({
          createdAt: -1,
        });


    // =================================================
    // SEND DATA TO ADMIN FRONTEND
    // =================================================

    res.status(200).json({

      success: true,

      data: users,

    });


  } catch (error) {

    console.error(
      "LOGIN ACTIVITY ERROR:",
      error
    );


    if (error.response) {

      console.error(
        "FRIEND API STATUS:",
        error.response.status
      );

      console.error(
        "FRIEND API DATA:",
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
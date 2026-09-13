const axios = require("axios");

const User = require("../Models/UserModel");

const sendWelcomeEmail = require("../Utils/sendEmail");


// =====================================================
// GET USERS FROM USER SIDE + STORE IN ADMIN DB
// =====================================================

const getAndSyncUsers = async (req, res) => {
  try {

    const response = await axios.get(
      `${process.env.USER_API_URL}/users/getdata`
    );

    const users = response.data;

    const savedUsers = [];

    for (const user of users) {

      const userId = user._id || user.id;

      const savedUser = await User.findOneAndUpdate(

        {
          email: user.email,
        },

        {
          userId: userId,

          name: user.name,

          email: user.email,

          phone: user.phone || "",

          age: user.age || null,

          gender: user.gender || "",

          address: user.address || "",

          status: "Active",
        },

        {
          new: true,

          upsert: true,
        }
      );

      savedUsers.push(savedUser);
    }


    res.status(200).json({
      success: true,

      message: "Users fetched and stored successfully",

      count: savedUsers.length,

      users: savedUsers,
    });

  } catch (error) {

    console.error("SYNC USERS ERROR:", error.message);

    res.status(500).json({
      success: false,

      message: "Failed to fetch and store users",

      error: error.message,
    });
  }
};


// =====================================================
// GET USERS FROM ADMIN DB
// =====================================================

const getUsers = async (req, res) => {

  try {

    const users = await User.find()
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,

      users: users,
    });

  } catch (error) {

    res.status(500).json({
      success: false,

      message: "Failed to get users",

      error: error.message,
    });
  }
};


// =====================================================
// LOGIN
// =====================================================

const loginUser = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;


    if (!email || !password) {

      return res.status(400).json({
        success: false,

        message: "Email and password are required",
      });

    }


    // ================================================
    // LOGIN THROUGH USER SIDE
    // ================================================

    const loginResponse = await axios.post(

      `${process.env.USER_API_URL}/users/login`,

      {
        email,
        password,
      }

    );


    const loggedUser = loginResponse.data.user;


    if (!loggedUser) {

      return res.status(401).json({
        success: false,

        message: "Invalid login response",
      });

    }


    // ================================================
    // STORE / UPDATE USER IN ADMIN DB
    // ================================================

    const user = await User.findOneAndUpdate(

      {
        email: loggedUser.email,
      },

      {
        userId: loggedUser._id || loggedUser.id,

        name: loggedUser.name,

        email: loggedUser.email,

        phone: loggedUser.phone || "",

        age: loggedUser.age || null,

        gender: loggedUser.gender || "",

        address: loggedUser.address || "",

        status: "Active",

        lastLogin: new Date(),
      },

      {
        new: true,

        upsert: true,
      }

    );


    // ================================================
    // SEND EMAIL
    // ================================================

    try {

      await sendWelcomeEmail(user);

      console.log(
        `Welcome email sent to ${user.email}`
      );

    } catch (emailError) {

      console.error(
        "EMAIL ERROR:",
        emailError.message
      );

    }


    // ================================================
    // SUCCESS RESPONSE
    // ================================================

    res.status(200).json({

      success: true,

      message: "Login successful",

      emailSent: true,

      user: user,

    });


  } catch (error) {

    console.error(
      "LOGIN ERROR:",
      error.response?.data || error.message
    );


    if (error.response) {

      return res.status(
        error.response.status || 401
      ).json({

        success: false,

        message:
          error.response.data?.message ||
          "Invalid email or password",

      });

    }


    res.status(500).json({

      success: false,

      message: "Login failed",

      error: error.message,

    });

  }
};


module.exports = {
  getAndSyncUsers,
  getUsers,
  loginUser,
};
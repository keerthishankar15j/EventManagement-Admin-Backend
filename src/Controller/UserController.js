const axios = require("axios");
const User = require("../Model/UserModel");
const sendWelcomeEmail = require("../Utils/sendEmail");

// =====================================================
// GET USERS FROM USER API + STORE IN ADMIN DB
// =====================================================

const getAndSyncUsers = async (req, res) => {
  try {
    if (!process.env.USER_API_URL) {
      return res.status(500).json({
        success: false,
        message: "USER_API_URL is not configured",
      });
    }

    const response = await axios.get(
      `${process.env.USER_API_URL}/users/getdata`
    );

    const users = Array.isArray(response.data)
      ? response.data
      : response.data?.users || [];

    const savedUsers = [];

    for (const user of users) {
      const userId = user._id || user.id;

      const savedUser = await User.findOneAndUpdate(
        {
          email: user.email,
        },
        {
          userId,
          name: user.name || "",
          email: user.email,
          phone: user.phone || "",
          age: user.age || null,
          gender: user.gender || "",
          address: user.address || "",
          profileImage: user.profileImage || "",
          bio: user.bio || "",
          role: user.role || "user",
          status: user.status || "Active",
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

      savedUsers.push(savedUser);
    }

    return res.status(200).json({
      success: true,
      message: "Users fetched and stored successfully",
      count: savedUsers.length,
      users: savedUsers,
    });
  } catch (error) {
    console.error(
      "SYNC USERS ERROR:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch and store users",
      error: error.response?.data?.message || error.message,
    });
  }
};

// =====================================================
// GET USERS FROM ADMIN DB
// =====================================================

const getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    if (!process.env.USER_API_URL) {
      return res.status(500).json({
        success: false,
        message: "USER_API_URL is not configured",
      });
    }

    const loginResponse = await axios.post(
      `${process.env.USER_API_URL}/users/login`,
      {
        email,
        password,
      }
    );

    const loggedUser = loginResponse.data?.user;

    if (!loggedUser) {
      return res.status(401).json({
        success: false,
        message: "Invalid login response",
      });
    }

    const user = await User.findOneAndUpdate(
      {
        email: loggedUser.email,
      },
      {
        userId: loggedUser._id || loggedUser.id,
        name: loggedUser.name || "",
        email: loggedUser.email,
        phone: loggedUser.phone || "",
        age: loggedUser.age || null,
        gender: loggedUser.gender || "",
        address: loggedUser.address || "",
        profileImage: loggedUser.profileImage || "",
        bio: loggedUser.bio || "",
        role: loggedUser.role || "user",
        status: "Active",
        lastLogin: new Date(),
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // Email should NOT break login
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

    return res.status(200).json({
      success: true,
      message: "Login successful",
      emailSent: true,
      user,
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

    return res.status(500).json({
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

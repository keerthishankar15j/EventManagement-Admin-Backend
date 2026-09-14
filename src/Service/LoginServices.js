const SignupModel = require("../model/SignupModel");
const LoginHistoryModel = require("../model/LoginHistoryModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const ADMIN_API_URL = process.env.ADMIN_API_URL;

const loginUserdata = async (body) => {
  try {
    const { email, password } = body;

    if (!email || !password) {
      return {
        success: false,
        message: "email and Password are required",
      };
    }

    const user = await SignupModel.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      "XH1KSP_VDM",
      {
        expiresIn: "12h",
      }
    );

    await LoginHistoryModel.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      loginTime: new Date(),
      logoutTime: null,
      status: "Active",
    });

    // IMMEDIATE ADMIN SYNC
    if (ADMIN_API_URL) {
      try {
        await axios.post(
          `${ADMIN_API_URL}/admin/sync-user`,
          {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            bio: user.bio || "",
            profileImage: user.profileImage || "",
            role: user.role || "user",
            status: "Online",
          },
          {
            timeout: 5000,
          }
        );

        console.log(
          "USER SYNCED TO ADMIN IMMEDIATELY"
        );
      } catch (error) {
        console.error(
          "ADMIN SYNC ERROR:",
          error.message
        );
      }
    }

    return {
      success: true,
      message: "Login Successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getUsersData = async () => {
  try {
    const users = await SignupModel.find({})
      .select("-password")
      .lean();

    return {
      success: true,
      message: "Users fetched successfully",
      users,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

const getIndividualUserData = async (id) => {
  try {
    const user = await SignupModel
      .findById(id)
      .select("-password")
      .lean();

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    return {
      success: true,
      message: "User details fetched successfully",
      user,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  loginUserdata,
  getUsersData,
  getIndividualUserData,
};
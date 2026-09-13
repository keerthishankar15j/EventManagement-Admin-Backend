const SignupModel = require(
  "../model/SignupModel"
);

const LoginHistoryModel = require(
  "../Model/LoginHistoryModel"
);

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =====================================================
// LOGIN
// =====================================================

const loginUserdata = async (body) => {
  try {
    const {
      email,
      password,
    } = body;

    if (!email || !password) {
      return {
        success: false,
        message:
          "Email and Password are required",
      };
    }

    const user =
      await SignupModel.findOne({
        email: email
          .toLowerCase()
          .trim(),
      });

    if (!user) {
      return {
        success: false,
        message: "User not found",
      };
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return {
        success: false,
        message: "Invalid password",
      };
    }

    // =================================================
    // JWT TOKEN
    // =================================================

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },

      process.env.JWT_SECRET ||
        "XH1KSP_VDM",

      {
        expiresIn: "12h",
      }
    );

    // =================================================
    // SAVE LOGIN HISTORY
    // =================================================

    await LoginHistoryModel.create({
      userId: user._id,
      name: user.name,
      email: user.email,
      loginTime: new Date(),
      logoutTime: null,
      status: "Active",
    });

    // =================================================
    // RESPONSE
    // =================================================

    return {
      success: true,
      message: "Login Successful",

      token: token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role || "user",
        bio: user.bio || "",
        profileImage:
          user.profileImage || "",
      },
    };

  } catch (error) {
    console.error(
      "LOGIN SERVICE ERROR:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

// =====================================================
// GET ALL USERS
// =====================================================

const getUsersData = async () => {
  try {
    const users =
      await SignupModel.find({})
        .select("-password")
        .lean();

    return {
      success: true,
      message:
        "Users fetched successfully",
      users: users,
    };

  } catch (error) {
    console.error(
      "GET USERS SERVICE ERROR:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

// =====================================================
// GET SINGLE USER
// =====================================================

const getIndividualUserData = async (id) => {
  try {
    const user =
      await SignupModel.findById(id)
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
      message:
        "User details fetched successfully",
      user: user,
    };

  } catch (error) {
    console.error(
      "GET INDIVIDUAL USER SERVICE ERROR:",
      error
    );

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
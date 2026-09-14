const mongoose = require("mongoose");
const LoginHistory = require("../Model/LoginHistory");

// ==========================================
// CREATE LOGIN HISTORY
// ==========================================

const createLoginHistory = async (userData) => {
  try {
    const { userId, name, email } = userData;

    if (!userId || !name || !email) {
      return {
        success: false,
        message: "userId, name and email are required",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid userId",
      };
    }

    const loginHistory = await LoginHistory.create({
      userId,
      name,
      email,
      loginTime: new Date(),
      logoutTime: null,
      status: "Active",
    });

    return {
      success: true,
      message: "Login history created successfully",
      loginHistory,
    };
  } catch (error) {
    console.error("Create Login History Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

// ==========================================
// LOGOUT USER
// ==========================================

const logoutUser = async (userId) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "userId is required",
      };
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid userId",
      };
    }

    const loginHistory = await LoginHistory.findOneAndUpdate(
      {
        userId,
        status: "Active",
      },
      {
        logoutTime: new Date(),
        status: "Logged Out",
      },
      {
        new: true,
        sort: {
          loginTime: -1,
        },
      }
    );

    if (!loginHistory) {
      return {
        success: false,
        message: "Active login session not found",
      };
    }

    return {
      success: true,
      message: "Logout time updated successfully",
      loginHistory,
    };
  } catch (error) {
    console.error("Logout Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

// ==========================================
// GET ALL LOGIN HISTORY
// ==========================================

const getAllLoginHistory = async () => {
  try {
    const history = await LoginHistory.find()
      .sort({
        loginTime: -1,
      })
      .lean();

    return {
      success: true,
      count: history.length,
      history,
    };
  } catch (error) {
    console.error("Get Login History Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

// ==========================================
// GET LOGIN HISTORY BY USER
// ==========================================

const getLoginHistoryByUser = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        message: "Invalid userId",
      };
    }

    const history = await LoginHistory.find({
      userId,
    })
      .sort({
        loginTime: -1,
      })
      .lean();

    return {
      success: true,
      count: history.length,
      history,
    };
  } catch (error) {
    console.error("Get User Login History Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  createLoginHistory,
  logoutUser,
  getAllLoginHistory,
  getLoginHistoryByUser,
};
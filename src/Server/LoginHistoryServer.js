const LoginHistory = require("../Model/LoginHistoryModel");

// =====================================================
// GET LOGIN HISTORY
// =====================================================

const getLoginHistoryData = async () => {
  try {
    const history = await LoginHistory.find()
      .sort({ loginTime: -1 });

    return {
      success: true,
      message: "Login history fetched successfully",
      history,
    };
  } catch (error) {
    console.error("GET LOGIN HISTORY SERVER ERROR:", error);

    return {
      success: false,
      message: "Failed to fetch login history",
      error: error.message,
    };
  }
};

// =====================================================
// LOGOUT USER
// =====================================================

const logoutUserData = async (userId) => {
  try {
    const activeLogin = await LoginHistory.findOne({
      userId,
      status: "Active",
    }).sort({ loginTime: -1 });

    if (!activeLogin) {
      return {
        success: false,
        message: "Active login session not found",
      };
    }

    activeLogin.logoutTime = new Date();
    activeLogin.status = "Logged Out";

    await activeLogin.save();

    return {
      success: true,
      message: "User logged out successfully",
      history: activeLogin,
    };
  } catch (error) {
    console.error("LOGOUT SERVER ERROR:", error);

    return {
      success: false,
      message: "Failed to logout user",
      error: error.message,
    };
  }
};

module.exports = {
  getLoginHistoryData,
  logoutUserData,
};
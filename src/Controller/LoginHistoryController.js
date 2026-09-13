const LoginHistory = require("../Model/LoginHistoryModel");
const connectDB = require("../database/config");

// =====================================================
// GET LOGIN HISTORY
// =====================================================

const getLoginHistory = async (req, res) => {
  try {
    await connectDB();

    const history = await LoginHistory.find()
      .sort({ loginTime: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      message: "Login history fetched successfully",
      history,
    });
  } catch (error) {
    console.error("GET LOGIN HISTORY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get login history",
      error: error.message,
    });
  }
};

// =====================================================
// LOGOUT USER
// =====================================================

const logoutUser = async (req, res) => {
  try {
    await connectDB();

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const activeLogin = await LoginHistory.findOne({
      userId,
      status: "Active",
    }).sort({ loginTime: -1 });

    if (!activeLogin) {
      return res.status(404).json({
        success: false,
        message: "Active login session not found",
      });
    }

    activeLogin.logoutTime = new Date();
    activeLogin.status = "Logged Out";

    await activeLogin.save();

    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
      data: activeLogin,
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

module.exports = {
  getLoginHistory,
  logoutUser,
};
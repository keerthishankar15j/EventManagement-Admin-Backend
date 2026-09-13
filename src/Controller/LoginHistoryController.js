const LoginHistory = require("../Models/LoginHistoryModel");

// =====================================================
// GET LOGIN HISTORY
// =====================================================

const getLoginHistory = async (req, res) => {
  try {
    const history = await LoginHistory.find()
      .sort({
        loginTime: -1,
      });

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (error) {
    console.error(
      "GET LOGIN HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get login history",
      error: error.message,
    });
  }
};

module.exports = {
  getLoginHistory,
};

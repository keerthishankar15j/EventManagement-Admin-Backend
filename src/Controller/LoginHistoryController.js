const {
  getLoginHistoryData,
  logoutUserData,
} = require("../server/LoginHistoryServer");

// =====================================================
// GET ALL LOGIN HISTORY
// =====================================================

const getLoginHistory = async (req, res) => {
  try {
    const result =
      await getLoginHistoryData();

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);

  } catch (error) {
    console.error(
      "GET LOGIN HISTORY ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// LOGOUT USER
// =====================================================

const logoutUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const result =
      await logoutUserData(userId);

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);

  } catch (error) {
    console.error(
      "LOGOUT USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getLoginHistory,
  logoutUser,
};
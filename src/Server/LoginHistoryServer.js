const LoginHistoryModel = require(
  "../Model/LoginHistoryModel"
);

// =====================================================
// GET ALL LOGIN HISTORY
// =====================================================

const getLoginHistoryData = async () => {
  try {
    const history =
      await LoginHistoryModel.find({})
        .sort({
          loginTime: -1,
        })
        .lean();

    return {
      success: true,
      message:
        "Login history fetched successfully",
      history: history,
    };

  } catch (error) {
    console.error(
      "GET LOGIN HISTORY SERVICE ERROR:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

// =====================================================
// LOGOUT USER
// =====================================================

const logoutUserData = async (userId) => {
  try {
    const loginHistory =
      await LoginHistoryModel.findOne({
        userId: userId,
        status: "Active",
      }).sort({
        loginTime: -1,
      });

    if (!loginHistory) {
      return {
        success: false,
        message:
          "Active login session not found",
      };
    }

    loginHistory.logoutTime =
      new Date();

    loginHistory.status =
      "Logged Out";

    await loginHistory.save();

    return {
      success: true,
      message:
        "Logout time saved successfully",
      history: loginHistory,
    };

  } catch (error) {
    console.error(
      "LOGOUT SERVICE ERROR:",
      error
    );

    return {
      success: false,
      message: error.message,
    };
  }
};

module.exports = {
  getLoginHistoryData,
  logoutUserData,
};
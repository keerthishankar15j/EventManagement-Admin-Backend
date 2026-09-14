const {
  createLoginHistory,
  logoutUser,
  getAllLoginHistory,
  getLoginHistoryByUser,
} = require("../Service/LoginHistoryService");

// ==========================================
// LOGIN
// ==========================================

const createLoginHistoryController = async (req, res) => {
  try {
    const result = await createLoginHistory(req.body);

    if (result.success) {
      return res.status(201).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    console.error("Login History Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// LOGOUT
// ==========================================

const logoutUserController = async (req, res) => {
  try {
    const { userId } = req.body;

    const result = await logoutUser(userId);

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    console.error("Logout Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL HISTORY
// ==========================================

const getAllLoginHistoryController = async (req, res) => {
  try {
    const result = await getAllLoginHistory();

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    console.error("Get Login History Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// GET HISTORY BY USER
// ==========================================

const getLoginHistoryByUserController = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await getLoginHistoryByUser(userId);

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);
  } catch (error) {
    console.error("Get User History Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createLoginHistoryController,
  logoutUserController,
  getAllLoginHistoryController,
  getLoginHistoryByUserController,
};
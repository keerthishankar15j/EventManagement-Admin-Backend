const {
  loginUserdata,
  getUsersData,
  getIndividualUserData,
} = require("../Server/LoginServer");

// Login user
const loginuser = async (req, res) => {
  try {
    const result = await loginUserdata(req.body);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Login Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Login failed",
    });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const result = await getUsersData();

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Users Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get users",
    });
  }
};

// Get individual user
const getIndividualUser = async (req, res) => {
  try {
    const result = await getIndividualUserData(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Get Individual User Controller Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get user",
    });
  }
};

module.exports = {
  loginuser,
  getUsers,
  getIndividualUser,
};
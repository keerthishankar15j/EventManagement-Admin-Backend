const {
  loginUserdata,
  getUsersData,
  getIndividualUserData,
} = require("../Server/LoginServer");

const loginuser = async (req, res) => {
  try {
    const result = await loginUserdata(req.body);

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);

  } catch (error) {
    console.error("LOGIN ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const result = await getUsersData();

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);

  } catch (error) {
    console.error("GET USERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getIndividualUser = async (req, res) => {
  try {
    const { id } = req.params;

    const result =
      await getIndividualUserData(id);

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(404).json(result);

  } catch (error) {
    console.error(
      "GET INDIVIDUAL USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  loginuser,
  getUsers,
  getIndividualUser,
};
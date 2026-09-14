const {
  syncUsersFromUserProject,
  getAdminUsers,
  getAdminUserById,
} = require("../Service/AdminUserService");


// ==========================================
// SYNC USERS
// ==========================================

const syncUsers = async (req, res) => {
  try {

    const result =
      await syncUsersFromUserProject();

    if (result.success) {

      return res.status(200).json(result);
    }

    return res.status(
      result.status === 404 ? 404 : 400
    ).json(result);

  } catch (error) {

    console.error(
      "Sync Users Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET ALL USERS
// ==========================================

const getAdminUsersController = async (req, res) => {
  try {

    const result =
      await getAdminUsers();

    if (result.success) {

      return res.status(200).json(result);
    }

    return res.status(400).json(result);

  } catch (error) {

    console.error(
      "Get Admin Users Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET USER BY ID
// ==========================================

const getAdminUserByIdController = async (req, res) => {
  try {

    const { id } = req.params;

    const result =
      await getAdminUserById(id);

    if (result.success) {

      return res.status(200).json(result);
    }

    return res.status(400).json(result);

  } catch (error) {

    console.error(
      "Get Admin User By ID Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  syncUsers,
  getAdminUsersController,
  getAdminUserByIdController,
};
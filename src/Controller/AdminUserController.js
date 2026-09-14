const {
  syncUsersFromUserProject,
  getAdminUsers,
  getAdminUserById,
} = require("../Service/AdminUserService");

// =====================================================
// SYNC USERS
// =====================================================

const syncUsers = async (req, res) => {
  try {
    const result =
      await syncUsersFromUserProject();

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);

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

// =====================================================
// GET ALL USERS
// =====================================================

const getAdminUsersController = async (
  req,
  res
) => {
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

// =====================================================
// GET SINGLE USER
// =====================================================

const getAdminUserByIdController = async (
  req,
  res
) => {
  try {
    const result =
      await getAdminUserById(
        req.params.id
      );

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(404).json(result);

  } catch (error) {
    console.error(
      "Get User By ID Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  syncUsers,
  getAdminUsersController,
  getAdminUserByIdController,
};
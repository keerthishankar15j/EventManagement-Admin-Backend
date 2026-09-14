const {
  syncUsersFromUserProject,
  getAdminUsers,
} = require("../Service/AdminUserService");


// =====================================================
// SYNC USERS
// =====================================================

const syncUsers = async (req, res) => {

  try {

    const result =
      await syncUsersFromUserProject();


    if (result.success) {

      return res.status(200).json(
        result
      );

    }


    return res.status(400).json(
      result
    );

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};


// =====================================================
// GET ADMIN USERS
// =====================================================

const getAdminUsersController = async (
  req,
  res
) => {

  try {

    const result =
      await getAdminUsers();


    if (result.success) {

      return res.status(200).json(
        result
      );

    }


    return res.status(400).json(
      result
    );

  } catch (error) {

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};


module.exports = {
  syncUsers,
  getAdminUsersController,
};
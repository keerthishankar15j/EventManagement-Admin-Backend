const {
  syncUsers,
  syncSingleUser,
  getAdminUsers,
  getAdminUserById,
} = require("../Service/AdminUserService");


// =====================================================
// SYNC ALL USERS
// =====================================================

const syncUsersController = async (req, res) => {

  try {

    const result =
      await syncUsers();


    if (result.success) {

      return res.status(200).json(result);

    }


    return res.status(400).json(result);


  } catch (error) {

    console.error(
      "SYNC USERS CONTROLLER ERROR:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


// =====================================================
// SYNC SINGLE USER IMMEDIATELY
// =====================================================

const syncSingleUserController = async (req, res) => {

  try {

    const result =
      await syncSingleUser(req.body);


    if (result.success) {

      return res.status(200).json(result);

    }


    return res.status(400).json(result);


  } catch (error) {

    console.error(
      "SYNC SINGLE USER CONTROLLER ERROR:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


// =====================================================
// GET ALL ADMIN USERS
// =====================================================

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
      "GET ADMIN USERS CONTROLLER ERROR:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


// =====================================================
// GET SINGLE ADMIN USER
// =====================================================

const getAdminUserByIdController = async (req, res) => {

  try {

    const { id } =
      req.params;


    const result =
      await getAdminUserById(id);


    if (result.success) {

      return res.status(200).json(result);

    }


    return res.status(404).json(result);


  } catch (error) {

    console.error(
      "GET USER BY ID ERROR:",
      error.message
    );


    return res.status(500).json({

      success: false,

      message:
        error.message,

    });

  }

};


// =====================================================
// EXPORT
// =====================================================

module.exports = {

  syncUsersController,

  syncSingleUserController,

  getAdminUsersController,

  getAdminUserByIdController,

};
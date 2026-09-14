const {
  saveUserToAdmin,
  getAllAdminUsers,
  getAdminUserById,
} = require("../Service/AdminUserService");


// =====================================================
// RECEIVE USER FROM USER BACKEND
// =====================================================

const receiveUser = async (req, res) => {
  try {

    console.log(
      "===================================="
    );

    console.log(
      "📥 USER RECEIVED FROM USER BACKEND"
    );

    console.log(
      req.body
    );

    console.log(
      "===================================="
    );


    const result =
      await saveUserToAdmin(req.body);


    if (!result.success) {

      return res.status(400).json(
        result
      );

    }


    return res.status(200).json(
      result
    );


  } catch (error) {

    console.error(
      "RECEIVE USER ERROR:",
      error.message
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

const getUsers = async (req, res) => {
  try {

    const result =
      await getAllAdminUsers();


    if (!result.success) {

      return res.status(500).json(
        result
      );

    }


    return res.status(200).json(
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
// GET SINGLE USER
// =====================================================

const getUserById = async (req, res) => {
  try {

    const { id } =
      req.params;


    const result =
      await getAdminUserById(id);


    if (!result.success) {

      return res.status(404).json(
        result
      );

    }


    return res.status(200).json(
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
// EXPORT
// =====================================================

module.exports = {
  receiveUser,
  getUsers,
  getUserById,
};
const User = require("../Model/UserModel");


// =====================================================
// GET ALL USERS
// =====================================================

const getAllUsers = async (req, res) => {

  try {

    const users = await User
      .find({ role: "user" })
      .select("-password")
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      count: users.length,
      users: users,
    });


  } catch (error) {

    console.error(
      "GET ALL USERS ERROR:",
      error
    );


    res.status(500).json({
      success: false,
      message: "Failed to get users",
    });

  }

};


// =====================================================
// GET SINGLE USER
// =====================================================

const getUserById = async (req, res) => {

  try {

    const user = await User
      .findById(req.params.id)
      .select("-password");


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    res.status(200).json({
      success: true,
      user: user,
    });


  } catch (error) {

    console.error(
      "GET USER ERROR:",
      error
    );


    res.status(500).json({
      success: false,
      message: "Failed to get user",
    });

  }

};


module.exports = {
  getAllUsers,
  getUserById,
};
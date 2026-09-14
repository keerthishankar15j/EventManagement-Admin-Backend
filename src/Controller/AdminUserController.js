const AdminUser = require("../Model/AdminUser");


// ==========================================
// RECEIVE USER FROM USER BACKEND
// ==========================================

const receiveUser = async (req, res) => {
  try {

    const user = req.body;

    console.log(
      "USER RECEIVED FROM USER BACKEND:",
      user
    );

    if (!user._id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }


    const userData = {
      sourceUserId: user._id,

      name: user.name || "",

      email: user.email,

      phone: user.phone || "",

      bio: user.bio || "",

      profileImage:
        user.profileImage || "",

      role:
        user.role || "user",

      status:
        user.status || "Offline",

      source:
        "user-project",
    };


    const savedUser =
      await AdminUser.findOneAndUpdate(

        {
          sourceUserId: user._id,
        },

        {
          $set: userData,
        },

        {
          new: true,
          upsert: true,
        }
      );


    console.log(
      "USER SAVED IN ADMIN DB:",
      savedUser
    );


    return res.status(200).json({
      success: true,

      message:
        "User synchronized successfully",

      user: savedUser,
    });

  } catch (error) {

    console.error(
      "RECEIVE USER ERROR:",
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

const getAdminUsers = async (req, res) => {

  try {

    const users =
      await AdminUser.find()
        .sort({
          createdAt: -1,
        })
        .lean();


    return res.status(200).json({
      success: true,

      count:
        users.length,

      users,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ==========================================
// GET SINGLE USER
// ==========================================

const getAdminUserById = async (
  req,
  res
) => {

  try {

    const { id } =
      req.params;


    const user =
      await AdminUser.findById(id)
        .lean();


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }


    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


module.exports = {
  receiveUser,
  getAdminUsers,
  getAdminUserById,
};
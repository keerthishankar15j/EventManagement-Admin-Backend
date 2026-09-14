const AdminUser = require("../Model/AdminUser");


// =====================================================
// SAVE / UPDATE USER
// =====================================================

const saveUserToAdmin = async (userData) => {
  try {

    if (!userData) {
      return {
        success: false,
        message: "User data is required",
      };
    }


    if (!userData._id) {
      return {
        success: false,
        message: "User ID is required",
      };
    }


    if (!userData.email) {
      return {
        success: false,
        message: "Email is required",
      };
    }


    const adminUserData = {

      sourceUserId:
        userData._id,

      name:
        userData.name || "",

      email:
        userData.email
          .toLowerCase()
          .trim(),

      phone:
        userData.phone || "",

      bio:
        userData.bio || "",

      profileImage:
        userData.profileImage || "",

      role:
        userData.role || "user",
    };


    // =================================================
    // UPSERT
    // =================================================

    const savedUser =
      await AdminUser.findOneAndUpdate(

        {
          sourceUserId:
            userData._id,
        },

        {
          $set:
            adminUserData,
        },

        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );


    console.log(
      "===================================="
    );

    console.log(
      "✅ USER SAVED IN ADMIN DB"
    );

    console.log(
      "Name:",
      savedUser.name
    );

    console.log(
      "Email:",
      savedUser.email
    );

    console.log(
      "===================================="
    );


    return {
      success: true,
      message: "User synced successfully",
      user: savedUser,
    };


  } catch (error) {

    console.error(
      "SAVE USER SERVICE ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


// =====================================================
// GET ALL ADMIN USERS
// =====================================================

const getAllAdminUsers = async () => {
  try {

    const users =
      await AdminUser.find()
        .sort({
          createdAt: -1,
        })
        .lean();


    return {
      success: true,
      count: users.length,
      users,
    };


  } catch (error) {

    console.error(
      "GET ADMIN USERS ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


// =====================================================
// GET SINGLE ADMIN USER
// =====================================================

const getAdminUserById = async (id) => {
  try {

    const user =
      await AdminUser.findById(id)
        .lean();


    if (!user) {

      return {
        success: false,
        message: "User not found",
      };

    }


    return {
      success: true,
      user,
    };


  } catch (error) {

    console.error(
      "GET ADMIN USER ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  saveUserToAdmin,
  getAllAdminUsers,
  getAdminUserById,
};
const AdminUser = require("../Model/AdminUser");


// ======================================================
// SAVE / UPDATE USER
// ======================================================

const syncUser = async (userData) => {
  try {

    if (!userData) {
      return {
        success: false,
        message: "User data is required",
      };
    }


    if (!userData.sourceUserId) {
      return {
        success: false,
        message: "sourceUserId is required",
      };
    }


    const data = {

      sourceUserId:
        userData.sourceUserId.toString(),

      name:
        userData.name || "",

      email:
        userData.email
          ? userData.email
              .toLowerCase()
              .trim()
          : "",

      role:
        userData.role || "user",

      phone:
        userData.phone || "",

      bio:
        userData.bio || "",

      profileImage:
        userData.profileImage || "",

      joinedAt:
        userData.joinedAt || null,

      lastLogin:
        userData.lastLogin || null,

      loginStatus:
        userData.loginStatus || "offline",

      loginType:
        userData.loginType || "normal",
    };


    const user =
      await AdminUser.findOneAndUpdate(

        {
          sourceUserId:
            data.sourceUserId,
        },

        {
          $set: data,
        },

        {
          new: true,
          upsert: true,
          runValidators: true,
        }

      );


    console.log(
      "✅ USER SAVED IN ADMIN DB:",
      user.email
    );


    return {

      success: true,

      message:
        "User synced successfully",

      user,

    };


  } catch (error) {

    console.error(
      "❌ ADMIN USER SAVE ERROR:",
      error.message
    );


    return {

      success: false,

      message:
        error.message,

    };

  }
};


// ======================================================
// GET ALL USERS
// ======================================================

const getAllUsers = async () => {

  try {

    const users =
      await AdminUser.find()
        .sort({
          lastLogin: -1,
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
      "❌ GET USERS ERROR:",
      error.message
    );


    return {

      success: false,

      message:
        error.message,

    };

  }
};


// ======================================================
// GET SINGLE USER
// ======================================================

const getSingleUser = async (id) => {

  try {

    const user =
      await AdminUser.findById(id)
        .lean();


    if (!user) {

      return {

        success: false,

        message:
          "User not found",

      };

    }


    return {

      success: true,

      user,

    };


  } catch (error) {

    return {

      success: false,

      message:
        error.message,

    };

  }
};


module.exports = {

  syncUser,

  getAllUsers,

  getSingleUser,

};
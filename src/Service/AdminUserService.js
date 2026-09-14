const AdminUser = require("../Model/AdminUser");

// ===============================
// SAVE / UPDATE USER
// ===============================
const saveUserToAdmin = async (userData) => {
  try {
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
      sourceUserId: userData._id,
      name: userData.name || "",
      email: userData.email,
      phone: userData.phone || "",
      bio: userData.bio || "",
      profileImage: userData.profileImage || "",
      role: userData.role || "user",
    };

    const savedUser =
      await AdminUser.findOneAndUpdate(
        {
          sourceUserId: userData._id,
        },
        {
          $set: adminUserData,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
        }
      );

    return {
      success: true,
      message: "User saved successfully",
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


// ===============================
// GET ALL USERS
// ===============================
const getAllAdminUsers = async () => {
  try {
    const users = await AdminUser.find()
      .sort({ createdAt: -1 })
      .lean();

    return {
      success: true,
      count: users.length,
      users,
    };
  } catch (error) {
    console.error(
      "GET USERS SERVICE ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


// ===============================
// GET SINGLE USER
// ===============================
const getAdminUserById = async (id) => {
  try {
    const user =
      await AdminUser.findById(id).lean();

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
      "GET USER SERVICE ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


module.exports = {
  saveUserToAdmin,
  getAllAdminUsers,
  getAdminUserById,
};
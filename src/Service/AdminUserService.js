const axios = require("axios");
const mongoose = require("mongoose");

const AdminUser = require("../Model/AdminUser");

// =====================================================
// SYNC USERS FROM USER PROJECT
// =====================================================

const syncUsersFromUserProject = async () => {
  try {
    const USER_API_URL =
      process.env.USER_API_URL;

    if (!USER_API_URL) {
      throw new Error(
        "USER_API_URL is not defined"
      );
    }

    const userApiUrl =
      `${USER_API_URL}/login/getusers`;

    console.log(
      "Calling User API:",
      userApiUrl
    );

    const response = await axios.get(
      userApiUrl,
      {
        timeout: 15000,
      }
    );

    console.log(
      "User API Status:",
      response.status
    );

    console.log(
      "User API Response:",
      response.data
    );

    // =================================================
    // GET USERS ARRAY
    // =================================================

    let users = [];

    if (Array.isArray(response.data)) {
      users = response.data;
    } else if (
      Array.isArray(response.data.users)
    ) {
      users = response.data.users;
    } else if (
      Array.isArray(response.data.data)
    ) {
      users = response.data.data;
    } else if (
      Array.isArray(
        response.data.getuserdata
      )
    ) {
      users =
        response.data.getuserdata;
    } else if (
      Array.isArray(
        response.data.getUsersData
      )
    ) {
      users =
        response.data.getUsersData;
    }

    console.log(
      "Users found:",
      users.length
    );

    if (!users.length) {
      return {
        success: false,
        message:
          "No users found from User API",
        count: 0,
      };
    }

    // =================================================
    // SAVE USERS
    // =================================================

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const user of users) {
      if (!user._id) {
        console.log(
          "Skipping user without _id:",
          user
        );

        skipped++;
        continue;
      }

      const userData = {
        sourceUserId: user._id,

        name:
          user.name || "",

        email:
          user.email || "",

        phone:
          user.phone || "",

        bio:
          user.bio || "",

        profileImage:
          user.profileImage || "",

        role:
          user.role || "user",

        source:
          "user-project",
      };

      const existingUser =
        await AdminUser.findOne({
          sourceUserId: user._id,
        });

      if (existingUser) {
        await AdminUser.updateOne(
          {
            sourceUserId: user._id,
          },
          {
            $set: userData,
          }
        );

        updated++;
      } else {
        await AdminUser.create(
          userData
        );

        inserted++;
      }
    }

    return {
      success: true,

      message:
        "Users synchronized successfully",

      total:
        users.length,

      inserted:
        inserted,

      updated:
        updated,

      skipped:
        skipped,
    };

  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "SYNC USERS ERROR"
    );

    console.error(
      "Message:",
      error.message
    );

    if (error.response) {
      console.error(
        "Status:",
        error.response.status
      );

      console.error(
        "Response:",
        error.response.data
      );
    }

    console.error(
      "================================="
    );

    return {
      success: false,

      message:
        error.response?.data?.message ||
        error.message,
    };
  }
};

// =====================================================
// GET ALL ADMIN USERS
// =====================================================

const getAdminUsers = async () => {
  try {
    const users =
      await AdminUser.find()
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      success: true,

      count:
        users.length,

      users:
        users,
    };

  } catch (error) {
    console.error(
      "Get Admin Users Error:",
      error
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
    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return {
        success: false,
        message: "Invalid user ID",
      };
    }

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
      user: user,
    };

  } catch (error) {
    console.error(
      "Get Admin User By ID Error:",
      error
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
  syncUsersFromUserProject,
  getAdminUsers,
  getAdminUserById,
};
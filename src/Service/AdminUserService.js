const axios = require("axios");

const AdminUser = require("../Model/AdminUser");

// =====================================================
// USER API URL
// =====================================================

const USER_API_URL =
  (
    process.env.USER_API_URL ||
    "https://event-user-one.vercel.app"
  )
    .trim()
    .replace(/\/+$/, "");

// =====================================================
// GET USERS FROM USER PROJECT
// =====================================================

const getUsersFromUserProject = async () => {
  try {
    const userApiUrl =
      `${USER_API_URL}/login/getusers`;

    console.log(
      "USER API URL:",
      userApiUrl
    );

    const response =
      await axios.get(
        userApiUrl,
        {
          timeout: 15000,
        }
      );

    console.log(
      "USER API STATUS:",
      response.status
    );

    console.log(
      "USER API RESPONSE:",
      response.data
    );

    if (
      response.data?.success === false
    ) {
      return {
        success: false,
        message:
          response.data.message ||
          "User API returned an error",
        users: [],
      };
    }

    let users = [];

    // ---------------------------------------------
    // Direct array
    // ---------------------------------------------

    if (
      Array.isArray(response.data)
    ) {
      users = response.data;
    }

    // ---------------------------------------------
    // { users: [] }
    // ---------------------------------------------

    else if (
      Array.isArray(
        response.data?.users
      )
    ) {
      users =
        response.data.users;
    }

    // ---------------------------------------------
    // { data: [] }
    // ---------------------------------------------

    else if (
      Array.isArray(
        response.data?.data
      )
    ) {
      users =
        response.data.data;
    }

    // ---------------------------------------------
    // { getuserdata: [] }
    // ---------------------------------------------

    else if (
      Array.isArray(
        response.data?.getuserdata
      )
    ) {
      users =
        response.data.getuserdata;
    }

    if (!users.length) {
      return {
        success: true,
        message:
          "No users found in User DB",
        users: [],
      };
    }

    return {
      success: true,
      message:
        "Users fetched from User DB",
      users,
    };

  } catch (error) {
    console.error(
      "GET USER API ERROR:",
      error.message
    );

    if (error.response) {
      console.error(
        "USER API STATUS:",
        error.response.status
      );

      console.error(
        "USER API DATA:",
        error.response.data
      );
    }

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message,
      users: [],
    };
  }
};


// =====================================================
// SAVE USERS INTO ADMIN DB
// =====================================================

const syncUsers = async () => {
  try {
    console.log(
      "SYNC USERS STARTED"
    );

    const result =
      await getUsersFromUserProject();

    if (!result.success) {
      return result;
    }

    const users =
      result.users;

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    // =================================================
    // STORE EACH USER
    // =================================================

    for (const user of users) {
      if (
        !user ||
        !user._id
      ) {
        skipped++;
        continue;
      }

      const userData = {
        sourceUserId:
          user._id,

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

        status:
          user.status || "Offline",

        source:
          "user-project",
      };

      const existingUser =
        await AdminUser.findOne({
          sourceUserId:
            user._id,
        });

      if (existingUser) {
        await AdminUser.updateOne(
          {
            sourceUserId:
              user._id,
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

    console.log(
      "SYNC USERS COMPLETED"
    );

    return {
      success: true,
      message:
        "Users synced successfully",
      total:
        users.length,
      inserted,
      updated,
      skipped,
    };

  } catch (error) {
    console.error(
      "SYNC USERS ERROR:",
      error.message
    );

    return {
      success: false,
      message:
        error.message,
    };
  }
};


// =====================================================
// SYNC ONE USER
// =====================================================

const syncSingleUser =
  async (user) => {
    try {
      if (
        !user ||
        !user._id
      ) {
        return {
          success: false,
          message:
            "Invalid user data",
        };
      }

      const userData = {
        sourceUserId:
          user._id,

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

        status:
          user.status || "Offline",

        source:
          "user-project",
      };

      const adminUser =
        await AdminUser.findOneAndUpdate(
          {
            sourceUserId:
              user._id,
          },
          {
            $set: userData,
          },
          {
            new: true,
            upsert: true,
          }
        );

      return {
        success: true,
        message:
          "User stored in Admin DB",
        user:
          adminUser,
      };

    } catch (error) {
      console.error(
        "SYNC SINGLE USER ERROR:",
        error.message
      );

      return {
        success: false,
        message:
          error.message,
      };
    }
  };


// =====================================================
// GET ADMIN USERS
// =====================================================
//
// IMPORTANT:
// Every time Admin frontend calls /admin/users,
// latest users are fetched from User DB first,
// then stored in Admin DB,
// then returned to frontend.
//
// No separate Sync button required.
// =====================================================

const getAdminUsers =
  async () => {
    try {
      // -----------------------------------------------
      // 1. Get latest users from User DB
      // -----------------------------------------------

      const result =
        await getUsersFromUserProject();

      if (!result.success) {
        return result;
      }

      const users =
        result.users;

      // -----------------------------------------------
      // 2. Store / update Admin DB
      // -----------------------------------------------

      for (const user of users) {
        if (
          !user ||
          !user._id
        ) {
          continue;
        }

        const userData = {
          sourceUserId:
            user._id,

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

          status:
            user.status || "Offline",

          source:
            "user-project",
        };

        await AdminUser.findOneAndUpdate(
          {
            sourceUserId:
              user._id,
          },
          {
            $set: userData,
          },
          {
            new: true,
            upsert: true,
          }
        );
      }

      // -----------------------------------------------
      // 3. Read from Admin DB
      // -----------------------------------------------

      const adminUsers =
        await AdminUser.find()
          .sort({
            createdAt: -1,
          })
          .lean();

      return {
        success: true,
        count:
          adminUsers.length,
        users:
          adminUsers,
      };

    } catch (error) {
      console.error(
        "GET ADMIN USERS ERROR:",
        error.message
      );

      return {
        success: false,
        message:
          error.message,
      };
    }
  };


// =====================================================
// GET SINGLE ADMIN USER
// =====================================================

const getAdminUserById =
  async (id) => {
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
      console.error(
        "GET USER BY ID ERROR:",
        error.message
      );

      return {
        success: false,
        message:
          error.message,
      };
    }
  };


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  syncUsers,
  syncSingleUser,
  getAdminUsers,
  getAdminUserById,
};
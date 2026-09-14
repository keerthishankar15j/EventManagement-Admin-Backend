const axios = require("axios");

const AdminUser =
  require("../Model/AdminUser");


// =====================================================
// GET USERS FROM USER PROJECT
// =====================================================

const getUsersFromUserProject = async () => {
  try {

    // =================================================
    // GET USER API URL
    // =================================================

    let USER_API_URL =
      process.env.USER_API_URL ||
      "https://event-user-one.vercel.app";

    // Remove spaces
    USER_API_URL =
      USER_API_URL.trim();

    // =================================================
    // FIX URL
    // =================================================

    // Remove trailing slash
    USER_API_URL =
      USER_API_URL.replace(/\/+$/, "");

    // Remove accidental http/https at the end
    USER_API_URL =
      USER_API_URL.replace(
        /https?$/i,
        ""
      );

    // Remove duplicate protocol
    USER_API_URL =
      USER_API_URL.replace(
        /^(https?:\/\/)+/i,
        ""
      );

    // Add correct protocol
    USER_API_URL =
      `https://${USER_API_URL}`;

    // =================================================
    // FINAL USER API URL
    // =================================================

    const userApiUrl =
      `${USER_API_URL}/login/getusers`;

    console.log(
      "===================================="
    );

    console.log(
      "USER API URL:",
      userApiUrl
    );

    console.log(
      "===================================="
    );

    // =================================================
    // CALL USER API
    // =================================================

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

    // =================================================
    // GET USERS
    // =================================================

    let users = [];

    // Response directly as array
    if (
      Array.isArray(
        response.data
      )
    ) {

      users =
        response.data;

    }

    // response.data.users
    else if (
      Array.isArray(
        response.data?.users
      )
    ) {

      users =
        response.data.users;

    }

    // response.data.data
    else if (
      Array.isArray(
        response.data?.data
      )
    ) {

      users =
        response.data.data;

    }

    // response.data.getuserdata
    else if (
      Array.isArray(
        response.data?.getuserdata
      )
    ) {

      users =
        response.data.getuserdata;

    }

    // =================================================
    // USER API RETURNED FAILURE
    // =================================================

    if (
      response.data?.success === false
    ) {

      return {

        success: false,

        message:
          response.data?.message ||
          "User API returned success:false",

        users: [],

      };
    }

    // =================================================
    // NO USERS
    // =================================================

    if (!users.length) {

      return {

        success: false,

        message:
          "User API connected successfully, but no users were found",

        users: [],

      };
    }

    // =================================================
    // SUCCESS
    // =================================================

    return {

      success: true,

      message:
        "Users fetched successfully from User API",

      users,

    };

  } catch (error) {

    console.error(
      "===================================="
    );

    console.error(
      "GET USER API ERROR"
    );

    console.error(
      "MESSAGE:",
      error.message
    );

    if (error.response) {

      console.error(
        "STATUS:",
        error.response.status
      );

      console.error(
        "DATA:",
        error.response.data
      );

    }

    console.error(
      "===================================="
    );

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
// SYNC ALL USERS
// =====================================================

const syncUsers = async () => {

  try {

    console.log(
      "===================================="
    );

    console.log(
      "SYNC ALL USERS STARTED"
    );

    console.log(
      "===================================="
    );

    // =================================================
    // GET USERS FROM USER PROJECT
    // =================================================

    const result =
      await getUsersFromUserProject();

    // =================================================
    // USER API ERROR
    // =================================================

    if (!result.success) {

      console.error(
        "USER API SYNC FAILED:",
        result.message
      );

      return result;
    }

    const users =
      result.users;

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    // =================================================
    // LOOP USERS
    // =================================================

    for (
      const user of users
    ) {

      // =================================================
      // INVALID USER
      // =================================================

      if (
        !user ||
        !user._id
      ) {

        skipped++;

        console.log(
          "Skipping user: _id missing"
        );

        continue;
      }

      // =================================================
      // USER DATA
      // =================================================

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

      // =================================================
      // FIND EXISTING USER
      // =================================================

      const existingUser =
        await AdminUser.findOne({
          sourceUserId:
            user._id,
        });

      // =================================================
      // UPDATE USER
      // =================================================

      if (existingUser) {

        await AdminUser.updateOne(

          {
            sourceUserId:
              user._id,
          },

          {
            $set:
              userData,
          }

        );

        updated++;

        console.log(
          "Updated user:",
          user.email
        );

      }

      // =================================================
      // INSERT USER
      // =================================================

      else {

        await AdminUser.create(
          userData
        );

        inserted++;

        console.log(
          "Inserted user:",
          user.email
        );

      }
    }

    // =================================================
    // SYNC SUCCESS
    // =================================================

    console.log(
      "===================================="
    );

    console.log(
      "SYNC ALL USERS COMPLETED"
    );

    console.log(
      "===================================="
    );

    return {

      success: true,

      message:
        "Users synchronized successfully",

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
// SYNC SINGLE USER IMMEDIATELY
// =====================================================

const syncSingleUser =
  async (user) => {

    try {

      // =================================================
      // VALIDATE USER
      // =================================================

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

      // =================================================
      // USER DATA
      // =================================================

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

        // Login user = Online
        status:
          "Online",

        source:
          "user-project",

      };

      // =================================================
      // INSERT OR UPDATE
      // =================================================

      const adminUser =
        await AdminUser.findOneAndUpdate(

          {
            sourceUserId:
              user._id,
          },

          {
            $set:
              userData,
          },

          {
            new: true,

            upsert: true,
          }

        );

      console.log(
        "===================================="
      );

      console.log(
        "USER SYNCED IMMEDIATELY"
      );

      console.log(
        "EMAIL:",
        user.email
      );

      console.log(
        "STATUS: Online"
      );

      console.log(
        "===================================="
      );

      return {

        success: true,

        message:
          "User synchronized immediately",

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
// GET ALL ADMIN USERS
// =====================================================

const getAdminUsers =
  async () => {

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

        users,

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
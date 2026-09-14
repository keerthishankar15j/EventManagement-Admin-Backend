const axios = require("axios");

const AdminUser =
  require("../Model/AdminUser");

// =====================================================
// GET USERS FROM USER PROJECT
// =====================================================

const getUsersFromUserProject = async () => {
  try {
    const USER_API_URL =
      process.env.USER_API_URL;

    if (!USER_API_URL) {
      throw new Error(
        "USER_API_URL is not defined in Admin backend environment variables"
      );
    }

    const cleanUrl =
      USER_API_URL.replace(/\/$/, "");

    const userApiUrl =
      `${cleanUrl}/login/getusers`;

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

    let users = [];

    // =================================================
    // RESPONSE IS ARRAY
    // =================================================

    if (
      Array.isArray(
        response.data
      )
    ) {
      users =
        response.data;
    }

    // =================================================
    // response.data.users
    // =================================================

    else if (
      Array.isArray(
        response.data?.users
      )
    ) {
      users =
        response.data.users;
    }

    // =================================================
    // response.data.data
    // =================================================

    else if (
      Array.isArray(
        response.data?.data
      )
    ) {
      users =
        response.data.data;
    }

    // =================================================
    // response.data.getuserdata
    // =================================================

    else if (
      Array.isArray(
        response.data?.getuserdata
      )
    ) {
      users =
        response.data.getuserdata;
    }

    // =================================================
    // USER API RETURNED ERROR
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
        "Users fetched from User API",
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
      "SYNC ALL USERS STARTED"
    );

    const result =
      await getUsersFromUserProject();

    // =================================================
    // USER API FAILED
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

    for (const user of users) {

      if (!user || !user._id) {

        skipped++;

        console.log(
          "Skipping user because _id is missing"
        );

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

      // =================================================
      // FIND EXISTING USER
      // =================================================

      const existingUser =
        await AdminUser.findOne({
          sourceUserId:
            user._id,
        });

      // =================================================
      // UPDATE
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
      // INSERT
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
    // SUCCESS
    // =================================================

    console.log(
      "SYNC ALL USERS COMPLETED"
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

const syncSingleUser = async (user) => {

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

      // Login time should be Online
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
      "USER SYNCED IMMEDIATELY:",
      user.email,
      "=> Online"
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

const getAdminUserById = async (id) => {

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
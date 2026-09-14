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
        "USER_API_URL is not defined"
      );

    }

    console.log(
      "Getting users from:",
      `${USER_API_URL}/login/getusers`
    );

    const response =
      await axios.get(
        `${USER_API_URL}/login/getusers`,
        {
          timeout: 15000,
        }
      );

    console.log(
      "USER API RESPONSE:",
      response.data
    );

    let users = [];


    // =================================================
    // RESPONSE ARRAY
    // =================================================

    if (
      Array.isArray(response.data)
    ) {

      users = response.data;

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


    if (!users.length) {

      return {

        success: false,

        message:
          "No users found from User API",

        users: [],

      };

    }


    return {

      success: true,

      users,

    };


  } catch (error) {

    console.error(
      "GET USER API ERROR:",
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
// SYNC ALL USERS
// =====================================================

const syncUsers = async () => {

  try {

    const result =
      await getUsersFromUserProject();


    if (!result.success) {

      return result;

    }


    const users =
      result.users;


    let inserted = 0;
    let updated = 0;


    // =================================================
    // LOOP
    // =================================================

    for (const user of users) {

      if (!user._id) {
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
      // CHECK USER
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

      }


      // =================================================
      // INSERT
      // =================================================

      else {

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

      inserted,

      updated,

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

    if (!user || !user._id) {

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
        user.status || "Online",

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
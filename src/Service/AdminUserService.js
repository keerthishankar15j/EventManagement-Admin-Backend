const AdminUser =
  require("../Model/AdminUser");


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


module.exports = {

  getAdminUsers,

  getAdminUserById,

};
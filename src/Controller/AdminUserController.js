const {
  getAdminUsers,
  getAdminUserById,
} = require("../Service/AdminUserService");


// =====================================================
// GET ALL USERS
// =====================================================

const getAdminUsersController =
  async (req, res) => {

    try {

      const result =
        await getAdminUsers();


      if (result.success) {

        return res
          .status(200)
          .json(result);

      }


      return res
        .status(500)
        .json(result);

    } catch (error) {

      console.error(
        "GET ADMIN USERS CONTROLLER ERROR:",
        error.message
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            error.message,

        });

    }

  };


// =====================================================
// GET SINGLE USER
// =====================================================

const getAdminUserByIdController =
  async (req, res) => {

    try {

      const { id } =
        req.params;


      const result =
        await getAdminUserById(id);


      if (result.success) {

        return res
          .status(200)
          .json(result);

      }


      return res
        .status(404)
        .json(result);

    } catch (error) {

      console.error(
        "GET USER BY ID CONTROLLER ERROR:",
        error.message
      );


      return res
        .status(500)
        .json({

          success: false,

          message:
            error.message,

        });

    }

  };


module.exports = {

  getAdminUsersController,

  getAdminUserByIdController,

};
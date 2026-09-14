const {

  syncUser,

  getAllUsers,

  getSingleUser,

} = require("../Service/AdminUserService");


// ======================================================
// USER BACKEND → ADMIN BACKEND
// ======================================================

const syncUserController =
  async (req, res) => {

    try {

      console.log(
        "===================================="
      );

      console.log(
        "📥 USER RECEIVED"
      );

      console.log(
        req.body
      );

      console.log(
        "===================================="
      );


      const result =
        await syncUser(
          req.body
        );


      if (!result.success) {

        return res
          .status(400)
          .json(result);

      }


      return res
        .status(200)
        .json(result);


    } catch (error) {

      console.error(
        "SYNC CONTROLLER ERROR:",
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


// ======================================================
// GET ALL USERS
// ======================================================

const getUsersController =
  async (req, res) => {

    try {

      const result =
        await getAllUsers();


      return res
        .status(200)
        .json(result);


    } catch (error) {

      return res
        .status(500)
        .json({

          success: false,

          message:
            error.message,

        });

    }

  };


// ======================================================
// GET SINGLE USER
// ======================================================

const getSingleUserController =
  async (req, res) => {

    try {

      const result =
        await getSingleUser(
          req.params.id
        );


      if (!result.success) {

        return res
          .status(404)
          .json(result);

      }


      return res
        .status(200)
        .json(result);


    } catch (error) {

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

  syncUserController,

  getUsersController,

  getSingleUserController,

};
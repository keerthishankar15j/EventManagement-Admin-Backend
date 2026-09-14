const express =
  require("express");

const router =
  express.Router();

const {
  getAdminUsersController,
  getAdminUserByIdController,
} =
  require(
    "../Controller/AdminUserController"
  );


// =====================================================
// GET ALL USERS
// =====================================================

router.get(
  "/users",
  getAdminUsersController
);


// =====================================================
// GET SINGLE USER
// =====================================================

router.get(
  "/users/:id",
  getAdminUserByIdController
);


module.exports =
  router;
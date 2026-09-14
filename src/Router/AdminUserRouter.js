const express = require("express");

const router =
  express.Router();

const {
  syncUsersController,
  syncSingleUserController,
  getAdminUsersController,
  getAdminUserByIdController,
} = require("../Controller/AdminUserController");


// =====================================================
// SYNC ALL
// =====================================================

router.post(
  "/sync-users",
  syncUsersController
);


// =====================================================
// SYNC ONE USER
// =====================================================

router.post(
  "/sync-user",
  syncSingleUserController
);


// =====================================================
// GET ALL USERS
// =====================================================

router.get(
  "/users",
  getAdminUsersController
);


// =====================================================
// GET ONE USER
// =====================================================

router.get(
  "/users/:id",
  getAdminUserByIdController
);


module.exports = router;
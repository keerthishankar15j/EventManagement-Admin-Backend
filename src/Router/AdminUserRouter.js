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
// SYNC ALL USERS
// =====================================================

router.post(
  "/sync-users",
  syncUsersController
);


// =====================================================
// SYNC ONE USER IMMEDIATELY
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
// GET SINGLE USER
// =====================================================

router.get(
  "/users/:id",
  getAdminUserByIdController
);


module.exports = router;
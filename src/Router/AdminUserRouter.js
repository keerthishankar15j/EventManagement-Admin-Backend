const express = require("express");

const router = express.Router();

const {
  syncUsers,
  getAdminUsersController,
  getAdminUserByIdController,
} = require("../Controller/AdminUserController");

// =====================================================
// SYNC USERS
// =====================================================

router.post(
  "/sync-users",
  syncUsers
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
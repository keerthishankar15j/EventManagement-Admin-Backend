const express = require("express");

const router = express.Router();

const {
  syncUsers,
  getAdminUsersController,
  getAdminUserByIdController,
} = require("../Controller/AdminUserController");


// ==========================================
// SYNC USERS
// POST /admin/sync-users
// ==========================================

router.post(
  "/sync-users",
  syncUsers
);


// ==========================================
// GET ALL USERS
// GET /admin/users
// ==========================================

router.get(
  "/users",
  getAdminUsersController
);


// ==========================================
// GET USER BY ID
// GET /admin/users/:id
// ==========================================

router.get(
  "/users/:id",
  getAdminUserByIdController
);


module.exports = router;
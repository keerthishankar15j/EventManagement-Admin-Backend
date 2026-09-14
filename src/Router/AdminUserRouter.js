const express = require("express");

const router = express.Router();

const {
  syncUsers,
  getAdminUsersController,
} = require(
  "../Controller/AdminUserController"
);


// =====================================================
// SYNC USERS FROM USER PROJECT
// =====================================================

router.post(
  "/sync-users",
  syncUsers
);


// =====================================================
// GET USERS FROM ADMIN DATABASE
// =====================================================

router.get(
  "/users",
  getAdminUsersController
);


module.exports = router;
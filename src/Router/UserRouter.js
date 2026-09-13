const express = require("express");

const router = express.Router();

const {
  getAndSyncUsers,
  getUsers,
  loginUser,
} = require("../Controller/UserController");

// =====================================================
// GET USERS FROM USER API + SYNC
// =====================================================

router.get(
  "/sync",
  getAndSyncUsers
);

// =====================================================
// GET USERS
// =====================================================

router.get(
  "/getusers",
  getUsers
);

// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  loginUser
);

module.exports = router;

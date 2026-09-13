const express = require("express");

const router = express.Router();

const {
  getAndSyncUsers,
  getUsers,
  loginUser,
} = require("../Controller/UserController");

// =====================================================
// SYNC USERS FROM USER API
// GET /login/sync
// =====================================================

router.get(
  "/sync",
  getAndSyncUsers
);

// =====================================================
// GET USERS
// GET /login/getusers
// =====================================================

router.get(
  "/getusers",
  getUsers
);

// =====================================================
// ALSO SUPPORT /login/
// =====================================================

router.get(
  "/",
  getUsers
);

// =====================================================
// LOGIN
// POST /login/login
// =====================================================

router.post(
  "/login",
  loginUser
);

module.exports = router;

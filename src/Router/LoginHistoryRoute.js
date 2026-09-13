const express = require("express");

const router = express.Router();

const {
  getLoginHistory,
  logoutUser,
} = require("../Controller/LoginHistoryController");

// =====================================================
// GET LOGIN HISTORY
// =====================================================

router.get(
  "/gethistory",
  getLoginHistory
);

// =====================================================
// LOGOUT USER
// =====================================================

router.post(
  "/logout",
  logoutUser
);

module.exports = router;
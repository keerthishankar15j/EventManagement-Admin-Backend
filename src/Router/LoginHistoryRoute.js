const express = require("express");

const router = express.Router();

const {
  getLoginHistory,
  logoutUser,
} = require("../controller/LoginHistoryController");

// GET LOGIN HISTORY
router.get(
  "/gethistory",
  getLoginHistory
);

// LOGOUT
router.post(
  "/logout",
  logoutUser
);

module.exports = router;
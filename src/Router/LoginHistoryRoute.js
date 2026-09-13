const express = require("express");

const {
  getLoginHistory,
} = require("../Controller/LoginHistoryController");

const router = express.Router();

// GET LOGIN HISTORY
router.get("/gethistory", getLoginHistory);

module.exports = router;
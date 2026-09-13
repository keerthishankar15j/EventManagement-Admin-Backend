const express = require("express");

const router = express.Router();

const {
  getLoginHistory,
} = require("../Controller/LoginHistoryController");

// GET LOGIN HISTORY
router.get("/gethistory", getLoginHistory);

module.exports = router;
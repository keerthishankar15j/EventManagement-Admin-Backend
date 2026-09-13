const express = require("express");

const {
  getLoginHistory,
} = require("../Controller/LoginHistoryController");

const router = express.Router();

router.get(
  "/gethistory",
  getLoginHistory
);

module.exports = router;
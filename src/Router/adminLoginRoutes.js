const express = require("express");

const router = express.Router();

const {
  getLoginHistory
} = require("../Controller/adminLoginController");


router.get(
  "/login-history",
  getLoginHistory
);


module.exports = router;
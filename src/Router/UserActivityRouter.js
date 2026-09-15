const express = require("express");

const router = express.Router();

const {
  getUserLoginDetails,
} = require(
  "../Controller/UserActivityController"
);

// =====================================================
// GET USER LOGIN DETAILS
// =====================================================

router.get(
  "/users",
  getUserLoginDetails
);

module.exports = router;
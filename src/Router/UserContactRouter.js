const express = require("express");

const router = express.Router();

const {
  getUserMessages,
  getContactRequests,
} = require(
  "../Controller/UserContactController"
);


// =====================================================
// USER MESSAGES
// =====================================================

router.get(
  "/messages",
  getUserMessages
);


// =====================================================
// CONTACT REQUESTS
// =====================================================

router.get(
  "/contacts",
  getContactRequests
);


module.exports = router;
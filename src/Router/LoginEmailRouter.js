const express = require("express");

const router = express.Router();

const {
  sendLoginEmail,
} = require("../Controller/LoginEmailController");

// =====================================================
// SEND LOGIN SUCCESS EMAIL
// =====================================================

router.post(
  "/send-login-email",
  sendLoginEmail
);

module.exports = router;
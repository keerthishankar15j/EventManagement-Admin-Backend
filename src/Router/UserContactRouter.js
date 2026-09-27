const express = require("express");

const router = express.Router();

const {
  getUserMessages,
  getContactRequests,
  getSingleContact,
} = require("../Controller/UserContactController");

// =====================================================
// GET ALL MESSAGES
// GET /user-contact/messages
// =====================================================

router.get(
  "/messages",
  getUserMessages
);

// =====================================================
// GET ALL CONTACT REQUESTS
// GET /user-contact/contacts
// =====================================================

router.get(
  "/contacts",
  getContactRequests
);

// =====================================================
// GET SINGLE MESSAGE
// GET /user-contact/messages/:id
// =====================================================

router.get(
  "/messages/:id",
  getSingleContact
);

// =====================================================
// GET SINGLE CONTACT
// GET /user-contact/contacts/:id
// =====================================================

router.get(
  "/contacts/:id",
  getSingleContact
);

module.exports = router;
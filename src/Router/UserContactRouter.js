
const express = require("express");

const router = express.Router();

const {
  getUserMessages,
  getContactRequests,
  getSingleContact,
  replyToUser,
} = require("../Controller/UserContactController");

// =====================================================
// GET ALL USER MESSAGES
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

// =====================================================
// REPLY TO USER
// POST /user-contact/reply/:id
// =====================================================

router.post(
  "/reply/:id",
  replyToUser
);

module.exports = router;


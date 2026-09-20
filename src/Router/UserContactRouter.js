const express = require("express");

const router = express.Router();

const {
  getUserMessages,
  getContactRequests,
  getSingleContact,
} = require("../Controller/UserContactController");


/* =====================================================
   GET ALL MESSAGES
===================================================== */

router.get(
  "/messages",
  getUserMessages
);


/* =====================================================
   GET ALL CONTACT REQUESTS
===================================================== */

router.get(
  "/contacts",
  getContactRequests
);


/* =====================================================
   GET SINGLE MESSAGE
===================================================== */

router.get(
  "/messages/:id",
  getSingleContact
);


/* =====================================================
   GET SINGLE CONTACT
===================================================== */

router.get(
  "/contacts/:id",
  getSingleContact
);


module.exports = router;
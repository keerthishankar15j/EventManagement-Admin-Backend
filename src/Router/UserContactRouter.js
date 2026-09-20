const express = require("express");

const router = express.Router();

const {
  getUserMessages,
  getContactRequests,
  getSingleContact,
} = require("../Controller/UserContactController");


router.get(
  "/messages",
  getUserMessages
);


router.get(
  "/contacts",
  getContactRequests
);


router.get(
  "/messages/:id",
  getSingleContact
);


router.get(
  "/contacts/:id",
  getSingleContact
);


module.exports = router;
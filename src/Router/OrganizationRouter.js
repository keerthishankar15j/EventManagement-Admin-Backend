const express = require("express");

const router = express.Router();

const {
  createOrganizationRequest,
  getAllOrganizationRequests,
  getOrganizationById,
  replyToOrganization,
  getUserOrganizationRequests,
} = require("../Controller/OrganizationController");


// USER
router.post(
  "/create",
  createOrganizationRequest
);


// ADMIN
router.get(
  "/all",
  getAllOrganizationRequests
);


router.get(
  "/get/:id",
  getOrganizationById
);


router.put(
  "/reply/:id",
  replyToOrganization
);


// USER
router.get(
  "/user/:userId",
  getUserOrganizationRequests
);


module.exports = router;
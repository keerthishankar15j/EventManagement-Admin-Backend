const express = require("express");

const router = express.Router();

const {
  getOrganizationRequests,
  getSingleOrganizationRequest,
} = require(
  "../Controller/OrganizationController"
);

// =====================================================
// GET ALL ORGANIZER REQUESTS
// GET /organization/requests
// =====================================================

router.get(
  "/requests",
  getOrganizationRequests
);

// =====================================================
// GET SINGLE ORGANIZER REQUEST
// GET /organization/requests/:id
// =====================================================

router.get(
  "/requests/:id",
  getSingleOrganizationRequest
);

module.exports = router;
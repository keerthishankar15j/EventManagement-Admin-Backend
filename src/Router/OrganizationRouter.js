const express = require("express");

const router = express.Router();

const {
  getOrganizationRequests,
  getSingleOrganizationRequest,
  updateOrganizationRequestStatus,
} = require("../Controller/OrganizationController");

// =====================================================
// GET ALL ORGANIZER REQUESTS
// GET /organization/requests
// =====================================================
router.get(
  "/test",
  (req, res) => {
    res.json({
      success: true,
      message: "Organization route is working"
    });
  }
);



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

// =====================================================
// APPROVE / REJECT ORGANIZER REQUEST
// PUT /organization/requests/:id/status
// =====================================================

router.put(
  "/requests/:id/status",
  updateOrganizationRequestStatus
);

module.exports = router;
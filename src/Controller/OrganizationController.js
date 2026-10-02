
const axios = require("axios");

const {
  sendOrganizerStatusEmail,
} = require("../Server/EmailServer");

// =====================================================
// USER SIDE ORGANIZER API
// =====================================================

const ORGANIZER_API =
  "https://user-api-iota-six.vercel.app/organizer-requests";

// =====================================================
// GET ALL ORGANIZER REQUESTS
// =====================================================

const getOrganizationRequests = async (req, res) => {
  try {
    console.log("Fetching all organizer requests...");

    const response = await axios.get(
      `${ORGANIZER_API}/getrequests`
    );

    console.log(
      "Organizer API response:",
      response.data
    );

    const requests =
      response.data?.data ||
      response.data?.requests ||
      response.data ||
      [];

    return res.status(200).json({
      success: true,
      message: "Organizer requests fetched successfully",
      data: Array.isArray(requests)
        ? requests
        : [],
    });

  } catch (error) {
    console.error(
      "GET ORGANIZER REQUESTS ERROR:",
      error.message
    );

    if (error.response) {
      console.error(
        "User API status:",
        error.response.status
      );

      console.error(
        "User API data:",
        error.response.data
      );
    }

    return res.status(500).json({
      success: false,
      message: "Unable to fetch organizer requests",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE ORGANIZER REQUEST
// =====================================================

const getSingleOrganizationRequest = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Organizer request ID is required",
      });
    }

    console.log(
      "Fetching organizer request:",
      id
    );

    const response = await axios.get(
      `${ORGANIZER_API}/getrequest/${id}`
    );

    console.log(
      "Single organizer response:",
      response.data
    );

    return res.status(200).json({
      success: true,
      message: "Organizer request fetched successfully",
      data:
        response.data?.data ||
        response.data?.request ||
        response.data,
    });

  } catch (error) {
    console.error(
      "GET SINGLE ORGANIZER REQUEST ERROR:",
      error.message
    );

    if (error.response) {
      console.error(
        "User API status:",
        error.response.status
      );

      console.error(
        "User API data:",
        error.response.data
      );
    }

    return res.status(500).json({
      success: false,
      message: "Unable to fetch organizer request",
      error: error.message,
    });
  }
};

// =====================================================
// APPROVE / REJECT ORGANIZER REQUEST
// EMAIL ONLY
// =====================================================

const updateOrganizationRequestStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      status,
      adminMessage,
    } = req.body;

    // =================================================
    // CHECK ID
    // =================================================

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Organizer request ID is required",
      });
    }

    // =================================================
    // CHECK STATUS
    // =================================================

    if (
      !["Approved", "Rejected"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be Approved or Rejected",
      });
    }

    console.log(
      "Organizer request ID:",
      id
    );

    console.log(
      "Organizer status:",
      status
    );

    console.log(
      "Admin message:",
      adminMessage
    );

    // =================================================
    // GET ORGANIZER DETAILS
    // =================================================

    const response = await axios.get(
      `${ORGANIZER_API}/getrequest/${id}`
    );

    console.log(
      "Organizer details:",
      response.data
    );

    const request =
      response.data?.data ||
      response.data?.request ||
      response.data;

    // =================================================
    // CHECK REQUEST
    // =================================================

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Organizer request not found",
      });
    }

    // =================================================
    // CHECK EMAIL
    // =================================================

    if (!request.email) {
      return res.status(400).json({
        success: false,
        message:
          "Organizer email not found",
      });
    }

    // =================================================
    // GET ORGANIZER INFORMATION
    // =================================================

    const organizerEmail =
      request.email;

    const organizerName =
      request.name || "Organizer";

    const eventName =
      request.eventName || "Your Event";

    console.log(
      "Organizer email:",
      organizerEmail
    );

    console.log(
      "Organizer name:",
      organizerName
    );

    console.log(
      "Event name:",
      eventName
    );

    // =================================================
    // SEND EMAIL
    // =================================================

    const emailSent =
      await sendOrganizerStatusEmail(
        organizerEmail,
        organizerName,
        eventName,
        status,
        adminMessage || ""
      );

    // =================================================
    // CHECK EMAIL RESULT
    // =================================================

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message:
          "Organizer email could not be sent",
      });
    }

    // =================================================
    // SUCCESS
    // =================================================

    console.log(
      `Organizer ${status} email sent successfully`
    );

    return res.status(200).json({
      success: true,
      message:
        `Organizer ${status.toLowerCase()} email sent successfully`,
    });

  } catch (error) {
    console.error(
      "ORGANIZER STATUS EMAIL ERROR:",
      error.message
    );

    if (error.response) {
      console.error(
        "User API status:",
        error.response.status
      );

      console.error(
        "User API data:",
        error.response.data
      );
    }

    return res.status(500).json({
      success: false,
      message:
        "Unable to send organizer status email",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getOrganizationRequests,
  getSingleOrganizationRequest,
  updateOrganizationRequestStatus,
};

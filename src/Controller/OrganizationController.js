const axios = require("axios");

const {
  sendOrganizerAcceptedEmail,
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
      "================================="
    );

    console.log(
      "ORGANIZER STATUS UPDATE"
    );

    console.log(
      "Request ID:",
      id
    );

    console.log(
      "Status:",
      status
    );

    console.log(
      "Admin Message:",
      adminMessage
    );

    console.log(
      "================================="
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
        message: "Organizer email not found",
      });
    }

    // =================================================
    // ORGANIZER DETAILS
    // =================================================

    const organizerEmail =
      request.email;

    const organizerName =
      request.name || "Organizer";

    const eventName =
      request.eventName || "Your Event";

    console.log(
      "Organizer Email:",
      organizerEmail
    );

    console.log(
      "Organizer Name:",
      organizerName
    );

    console.log(
      "Event Name:",
      eventName
    );

    // =================================================
    // SEND EMAIL ONLY WHEN APPROVED
    // =================================================

    if (status === "Approved") {

      console.log(
        "Sending organizer accepted email..."
      );

      const emailResult =
        await sendOrganizerAcceptedEmail(
          organizerEmail,
          organizerName,
          eventName
        );

      console.log(
        "Organizer email result:",
        emailResult
      );

      // =================================================
      // CHECK EMAIL RESULT
      // =================================================

      if (
        !emailResult ||
        emailResult.success === false
      ) {

        console.error(
          "Organizer accepted email failed:",
          emailResult
        );

        return res.status(500).json({
          success: false,
          message:
            "Organizer email could not be sent",
          error:
            emailResult?.error ||
            "Unknown email error",
        });
      }

      console.log(
        "Organizer accepted email sent successfully"
      );
    }

    // =================================================
    // REJECTED
    // =================================================

    if (status === "Rejected") {

      console.log(
        "Organizer request rejected."
      );

      // We are not sending the accepted email
      // for rejected requests.
    }

    // =================================================
    // SUCCESS
    // =================================================

    return res.status(200).json({
      success: true,
      message:
        status === "Approved"
          ? "Organizer approved and email sent successfully"
          : "Organizer request rejected successfully",
    });

  } catch (error) {

    console.error(
      "================================="
    );

    console.error(
      "ORGANIZER STATUS ERROR"
    );

    console.error(
      error
    );

    console.error(
      "Error message:",
      error.message
    );

    console.error(
      "================================="
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
        "Unable to process organizer request",
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
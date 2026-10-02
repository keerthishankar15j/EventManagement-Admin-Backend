const axios = require("axios");

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
    console.log(
      "Fetching all organizer requests..."
    );

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
      message:
        "Organizer requests fetched successfully",

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
      message:
        "Unable to fetch organizer requests",
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
        message:
          "Organizer request ID is required",
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

      message:
        "Organizer request fetched successfully",

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

      message:
        "Unable to fetch organizer request",

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

    // -----------------------------------------------
    // CHECK ID
    // -----------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message:
          "Organizer request ID is required",
      });
    }

    // -----------------------------------------------
    // CHECK STATUS
    // -----------------------------------------------

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
      "Updating organizer request:",
      id
    );

    console.log(
      "New status:",
      status
    );

    console.log(
      "Admin message:",
      adminMessage
    );

    // =================================================
    // CALL USER BACKEND
    // =================================================

    const response = await axios.put(
      `${ORGANIZER_API}/update-status/${id}`,
      {
        status,
        adminMessage:
          adminMessage || "",
      }
    );

    console.log(
      "Update organizer response:",
      response.data
    );

    return res.status(200).json({
      success: true,

      message:
        `Organizer request ${status.toLowerCase()} successfully`,

      data:
        response.data?.data ||
        response.data?.request ||
        response.data,
    });

  } catch (error) {
    console.error(
      "UPDATE ORGANIZER REQUEST ERROR:",
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

      return res.status(
        error.response.status || 500
      ).json({
        success: false,

        message:
          error.response.data?.message ||
          "Unable to update organizer request",

        error:
          error.response.data ||
          error.message,
      });
    }

    return res.status(500).json({
      success: false,

      message:
        "Unable to update organizer request",

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
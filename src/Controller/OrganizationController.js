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

module.exports = {
  getOrganizationRequests,
  getSingleOrganizationRequest,
};
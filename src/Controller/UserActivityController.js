const axios = require("axios");

// =====================================================
// GET USER LOGIN DETAILS FROM FRIEND'S API
// =====================================================

const getUserLoginDetails = async (req, res) => {
  try {
    const response = await axios.get(
      process.env.FRIEND_LOGIN_API_URL
    );

    console.log(
      "Friend API response:",
      response.data
    );

    // -------------------------------------------------
    // Return friend's data to our admin frontend
    // -------------------------------------------------

    res.status(200).json({
      success: true,
      data: response.data.data || response.data,
    });

  } catch (error) {

    console.log(
      "Friend API Error:",
      error.message
    );

    if (error.response) {
      console.log(
        "Friend API status:",
        error.response.status
      );

      console.log(
        "Friend API data:",
        error.response.data
      );
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch user login details",
      error: error.message,
    });
  }
};

module.exports = {
  getUserLoginDetails,
};
const axios = require("axios");

// =====================================================
// GET ALL USER CONTACT / MESSAGE DATA
// =====================================================

const getUserMessages = async (req, res) => {
  try {
    const response = await axios.get(
      process.env.FRIEND_CONTACT_API_URL
    );

    console.log(
      "FRIEND CONTACT API RESPONSE:",
      response.data
    );

    const contacts =
      response.data?.contacts || [];

    res.status(200).json({
      success: true,
      message:
        "User messages fetched successfully",
      data: contacts,
    });

  } catch (error) {
    console.error(
      "USER MESSAGE ERROR:",
      error.message
    );

    if (error.response) {
      console.error(
        "FRIEND API STATUS:",
        error.response.status
      );

      console.error(
        "FRIEND API DATA:",
        error.response.data
      );
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch user messages",
      error: error.message,
    });
  }
};


// =====================================================
// GET CONTACT REQUESTS
// =====================================================

const getContactRequests = async (req, res) => {
  try {
    const response = await axios.get(
      process.env.FRIEND_CONTACT_API_URL
    );

    console.log(
      "FRIEND CONTACT API RESPONSE:",
      response.data
    );

    const contacts =
      response.data?.contacts || [];

    res.status(200).json({
      success: true,
      message:
        "Contact requests fetched successfully",
      data: contacts,
    });

  } catch (error) {
    console.error(
      "CONTACT REQUEST ERROR:",
      error.message
    );

    if (error.response) {
      console.error(
        "FRIEND API STATUS:",
        error.response.status
      );

      console.error(
        "FRIEND API DATA:",
        error.response.data
      );
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch contact requests",
      error: error.message,
    });
  }
};


// =====================================================
// GET SINGLE CONTACT
// =====================================================

const getSingleContact = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await axios.get(
      `https://user-api-iota-six.vercel.app/contact/getcontact/${id}`
    );

    res.status(200).json({
      success: true,
      data:
        response.data?.contact ||
        response.data,
    });

  } catch (error) {
    console.error(
      "SINGLE CONTACT ERROR:",
      error.message
    );

    if (error.response) {
      console.error(
        "FRIEND API STATUS:",
        error.response.status
      );

      console.error(
        "FRIEND API DATA:",
        error.response.data
      );
    }

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch contact",
      error: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getUserMessages,
  getContactRequests,
  getSingleContact,
};
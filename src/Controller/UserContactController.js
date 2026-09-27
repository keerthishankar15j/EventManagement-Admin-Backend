const axios = require("axios");

// =====================================================
// FRIEND API URL
// =====================================================

const getFriendContactApi = () => {
  const apiUrl =
    process.env.FRIEND_CONTACT_API_URL;

  if (!apiUrl) {
    throw new Error(
      "FRIEND_CONTACT_API_URL is not configured"
    );
  }

  return apiUrl;
};

// =====================================================
// GET ALL USER MESSAGES
// =====================================================

const getUserMessages = async (req, res) => {
  try {

    const apiUrl = getFriendContactApi();

    console.log(
      "Calling Friend Contact API:",
      apiUrl
    );

    const response = await axios.get(apiUrl);

    console.log(
      "Friend Contact API Response:",
      response.data
    );

    const contacts =
      response.data?.contacts ||
      response.data?.data ||
      response.data ||
      [];

    return res.status(200).json({
      success: true,
      message:
        "User messages fetched successfully",
      data: Array.isArray(contacts)
        ? contacts
        : [],
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

    return res.status(500).json({
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

    const apiUrl = getFriendContactApi();

    console.log(
      "Calling Friend Contact API:",
      apiUrl
    );

    const response = await axios.get(apiUrl);

    console.log(
      "Friend Contact API Response:",
      response.data
    );

    const contacts =
      response.data?.contacts ||
      response.data?.data ||
      response.data ||
      [];

    return res.status(200).json({
      success: true,
      message:
        "Contact requests fetched successfully",
      data: Array.isArray(contacts)
        ? contacts
        : [],
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

    return res.status(500).json({
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

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    const response = await axios.get(
      `https://user-api-iota-six.vercel.app/contact/getcontact/${id}`
    );

    return res.status(200).json({
      success: true,
      data:
        response.data?.contact ||
        response.data?.data ||
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

    return res.status(500).json({
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
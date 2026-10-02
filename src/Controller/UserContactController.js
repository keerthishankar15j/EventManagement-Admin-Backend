
const axios = require("axios");

const {
  sendAdminReplyEmail,
} = require("../Server/EmailServer");

// =====================================================
// FRIEND CONTACT API
// =====================================================

const getFriendContactApi = () => {
  const apiUrl = process.env.FRIEND_CONTACT_API_URL;

  if (!apiUrl) {
    throw new Error(
      "FRIEND_CONTACT_API_URL is not configured"
    );
  }

  return apiUrl;
};

// =====================================================
// GET ALL USER MESSAGES
// GET /user-contact/messages
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
      message: "User messages fetched successfully",
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
      message: "Unable to fetch user messages",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL CONTACT REQUESTS
// GET /user-contact/contacts
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
      message: "Contact requests fetched successfully",
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
      message: "Unable to fetch contact requests",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE CONTACT
// GET /user-contact/contacts/:id
// GET /user-contact/messages/:id
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

    console.log(
      "Getting single contact:",
      id
    );

    const response = await axios.get(
      `https://user-api-iota-six.vercel.app/contact/getcontact/${id}`
    );

    console.log(
      "Single contact response:",
      response.data
    );

    const contact =
      response.data?.contact ||
      response.data?.data ||
      response.data;

    return res.status(200).json({
      success: true,
      data: contact,
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
      message: "Unable to fetch contact",
      error: error.message,
    });
  }
};

// =====================================================
// REPLY TO USER
// POST /user-contact/reply/:id
// =====================================================

const replyToUser = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      reply,
      adminReply,
    } = req.body;

    // -------------------------------------------------
    // CHECK ID
    // -------------------------------------------------

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Contact ID is required",
      });
    }

    // -------------------------------------------------
    // GET ADMIN REPLY
    // -------------------------------------------------

    const replyMessage =
      adminReply || reply;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: "Reply message is required",
      });
    }

    console.log(
      "Replying to contact:",
      id
    );

    console.log(
      "Admin reply:",
      replyMessage
    );

    // -------------------------------------------------
    // GET USER CONTACT DETAILS
    // -------------------------------------------------

    const response = await axios.get(
      `https://user-api-iota-six.vercel.app/contact/getcontact/${id}`
    );

    console.log(
      "Contact API response:",
      response.data
    );

    const contact =
      response.data?.contact ||
      response.data?.data ||
      response.data;

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    // -------------------------------------------------
    // GET USER DETAILS
    // -------------------------------------------------

    const userEmail =
      contact.email;

    const userName =
      contact.name ||
      contact.userName ||
      contact.username ||
      "User";

    const originalMessage =
      contact.message ||
      "";

    console.log(
      "User email:",
      userEmail
    );

    console.log(
      "User name:",
      userName
    );

    // -------------------------------------------------
    // CHECK EMAIL
    // -------------------------------------------------

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email not found",
      });
    }

    // -------------------------------------------------
    // SEND EMAIL
    // -------------------------------------------------

    const emailSent =
      await sendAdminReplyEmail(
        userEmail,
        userName,
        originalMessage,
        replyMessage
      );

    // -------------------------------------------------
    // EMAIL FAILED
    // -------------------------------------------------

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message:
          "Reply email could not be sent",
      });
    }

    // -------------------------------------------------
    // SUCCESS
    // -------------------------------------------------

    console.log(
      "Admin reply email sent successfully"
    );

    return res.status(200).json({
      success: true,
      message: "Reply sent successfully",
    });

  } catch (error) {
    console.error(
      "REPLY TO USER ERROR:",
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
      message: "Unable to send reply",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT ALL FUNCTIONS
// =====================================================

module.exports = {
  getUserMessages,
  getContactRequests,
  getSingleContact,
  replyToUser,
};


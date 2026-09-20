const axios = require("axios");

const UserMessage = require(
  "../Model/UserMessageModel"
);

const ContactRequest = require(
  "../Model/ContactRequestModel"
);


// =====================================================
// GET USER MESSAGES
// =====================================================

const getUserMessages = async (req, res) => {

  try {

    const response = await axios.get(
      process.env.USER_MESSAGES_API_URL
    );

    console.log(
      "User Messages API Response:",
      response.data
    );


    // -----------------------------------------------
    // Get messages array
    // -----------------------------------------------

    const messages =
      response.data?.data?.messages ||
      response.data?.messages ||
      response.data?.data ||
      response.data ||
      [];


    if (!Array.isArray(messages)) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid message data received",
      });

    }


    // -----------------------------------------------
    // Store new messages in Admin DB
    // -----------------------------------------------

    for (const message of messages) {

      const messageId =
        message.messageId ||
        message._id ||
        message.id;


      if (!messageId) {
        continue;
      }


      const existingMessage =
        await UserMessage.findOne({
          userId: String(messageId),
        });


      if (!existingMessage) {

        await UserMessage.create({

          userId:
            String(messageId),

          name:
            message.name ||
            "Unknown User",

          email:
            message.email ||
            "",

          subject:
            message.subject ||
            "",

          message:
            message.message ||
            "",

          status:
            "Unread",

        });

      }

    }


    // -----------------------------------------------
    // Get data from Admin DB
    // -----------------------------------------------

    const allMessages =
      await UserMessage.find()
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({

      success: true,

      count:
        allMessages.length,

      data:
        allMessages,

    });

  } catch (error) {

    console.error(
      "User Messages Error:",
      error.message
    );

    if (error.response) {

      console.error(
        "User API Status:",
        error.response.status
      );

      console.error(
        "User API Data:",
        error.response.data
      );

    }


    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch user messages",

      error:
        error.message,

    });

  }

};


// =====================================================
// GET CONTACT REQUESTS
// =====================================================

const getContactRequests = async (req, res) => {

  try {

    const response = await axios.get(
      process.env.USER_CONTACT_API_URL
    );

    console.log(
      "User Contact API Response:",
      response.data
    );


    // -----------------------------------------------
    // Get contacts array
    // -----------------------------------------------

    const contacts =
      response.data?.data?.contacts ||
      response.data?.contacts ||
      response.data?.data ||
      response.data ||
      [];


    if (!Array.isArray(contacts)) {

      return res.status(400).json({
        success: false,
        message:
          "Invalid contact data received",
      });

    }


    // -----------------------------------------------
    // Store contacts in Admin DB
    // -----------------------------------------------

    for (const contact of contacts) {

      const contactId =
        contact.contactId ||
        contact._id ||
        contact.id;


      if (!contactId) {
        continue;
      }


      const existingContact =
        await ContactRequest.findOne({
          userId: String(contactId),
        });


      if (!existingContact) {

        await ContactRequest.create({

          userId:
            String(contactId),

          name:
            contact.name ||
            "Unknown User",

          email:
            contact.email ||
            "",

          phone:
            contact.phone ||
            contact.number ||
            "",

          message:
            contact.message ||
            "",

          status:
            "Pending",

        });

      }

    }


    // -----------------------------------------------
    // Get Admin DB data
    // -----------------------------------------------

    const allContacts =
      await ContactRequest.find()
        .sort({
          createdAt: -1,
        });


    return res.status(200).json({

      success: true,

      count:
        allContacts.length,

      data:
        allContacts,

    });

  } catch (error) {

    console.error(
      "Contact Request Error:",
      error.message
    );

    if (error.response) {

      console.error(
        "User Contact API Status:",
        error.response.status
      );

      console.error(
        "User Contact API Data:",
        error.response.data
      );

    }


    return res.status(500).json({

      success: false,

      message:
        "Unable to fetch contact requests",

      error:
        error.message,

    });

  }

};


module.exports = {
  getUserMessages,
  getContactRequests,
};
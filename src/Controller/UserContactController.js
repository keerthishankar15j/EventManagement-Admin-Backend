const axios = require("axios");


/* =====================================================
   GET SINGLE CONTACT / MESSAGE
===================================================== */

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


    console.log(
      "Single Contact API Response:",
      response.data
    );


    const contact =
      response.data?.contact ||
      response.data?.data;


    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }


    res.status(200).json({
      success: true,
      message: "Contact fetched successfully",
      data: contact,
    });


  } catch (error) {

    console.error(
      "GET SINGLE CONTACT ERROR:",
      error.message
    );


    if (error.response) {

      console.error(
        "User API Status:",
        error.response.status
      );

      console.error(
        "User API Response:",
        error.response.data
      );

    }


    res.status(
      error.response?.status === 404
        ? 404
        : 500
    ).json({

      success: false,

      message:
        error.response?.status === 404
          ? "Contact not found"
          : "Unable to fetch contact",

      error: error.message,

    });

  }
};


module.exports = {
  getUserMessages,
  getContactRequests,
  getSingleContact,
};
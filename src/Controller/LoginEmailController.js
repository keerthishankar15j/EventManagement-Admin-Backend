const {
  sendLoginSuccessEmail,
} = require("../Service/EmailService");

// =====================================================
// SEND LOGIN SUCCESS EMAIL
// =====================================================

const sendLoginEmail = async (req, res) => {
  try {
    const {
      name,
      email,
    } = req.body;

    // Check email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    // Send email
    const result = await sendLoginSuccessEmail({
      name: name || "User",
      email: email,
    });

    if (result.success) {
      return res.status(200).json(result);
    }

    return res.status(400).json(result);

  } catch (error) {

    console.error(
      "SEND LOGIN EMAIL CONTROLLER ERROR:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  sendLoginEmail,
};
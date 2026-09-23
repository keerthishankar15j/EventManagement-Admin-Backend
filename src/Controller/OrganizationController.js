const OrganizationRequest = require("../Model/OrganizationModel");
const sendOrganizationReplyEmail = require("../Server/EmailServer");

// ======================================================
// USER → SEND ORGANIZATION REQUEST
// ======================================================

const createOrganizationRequest = async (req, res) => {
  try {
    const {
      userId,
      name,
      email,
      phone,
      organizationName,
      organizationType,
      eventName,
      eventDate,
      location,
      numberOfPeople,
      requirements,
      message,
    } = req.body;

    if (
      !userId ||
      !name ||
      !email ||
      !phone ||
      !organizationName ||
      !organizationType ||
      !eventName ||
      !eventDate ||
      !location ||
      !numberOfPeople
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const organization = new OrganizationRequest({
      userId,
      name,
      email,
      phone,
      organizationName,
      organizationType,
      eventName,
      eventDate,
      location,
      numberOfPeople,
      requirements,
      message,
    });

    const savedOrganization = await organization.save();

    res.status(201).json({
      success: true,
      message: "Organization request sent successfully",
      data: savedOrganization,
    });
  } catch (error) {
    console.error("CREATE ORGANIZATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create organization request",
      error: error.message,
    });
  }
};


// ======================================================
// ADMIN → GET ALL ORGANIZATION REQUESTS
// ======================================================

const getAllOrganizationRequests = async (req, res) => {
  try {
    const organizations = await OrganizationRequest.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    console.error("GET ORGANIZATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get organization requests",
      error: error.message,
    });
  }
};


// ======================================================
// ADMIN → GET ONE ORGANIZATION REQUEST
// ======================================================

const getOrganizationById = async (req, res) => {
  try {
    const organization = await OrganizationRequest.findById(
      req.params.id
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization request not found",
      });
    }

    res.status(200).json({
      success: true,
      data: organization,
    });
  } catch (error) {
    console.error("GET ORGANIZATION BY ID ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get organization request",
      error: error.message,
    });
  }
};


// ======================================================
// ADMIN → SEND REPLY
// ======================================================

const replyToOrganization = async (req, res) => {
  try {
    const { reply } = req.body;

    if (!reply || reply.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Reply is required",
      });
    }

    const organization = await OrganizationRequest.findById(
      req.params.id
    );

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization request not found",
      });
    }

    organization.adminReply = reply;
    organization.status = "Replied";
    organization.repliedAt = new Date();

    const updatedOrganization = await organization.save();

    // ==========================================
    // SEND EMAIL TO USER
    // ==========================================

    try {
      await sendOrganizationReplyEmail(
        organization.email,
        organization.name,
        organization.organizationName,
        reply
      );
    } catch (emailError) {
      console.error("EMAIL ERROR:", emailError);

      // Database reply is already saved.
      // Email failure should not remove the reply.
    }

    res.status(200).json({
      success: true,
      message: "Reply sent successfully",
      data: updatedOrganization,
    });
  } catch (error) {
    console.error("REPLY ORGANIZATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send reply",
      error: error.message,
    });
  }
};


// ======================================================
// USER → GET THEIR ORGANIZATION REQUESTS
// ======================================================

const getUserOrganizationRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const organizations = await OrganizationRequest.find({
      userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: organizations.length,
      data: organizations,
    });
  } catch (error) {
    console.error("GET USER ORGANIZATION ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get user organization requests",
      error: error.message,
    });
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  createOrganizationRequest,
  getAllOrganizationRequests,
  getOrganizationById,
  replyToOrganization,
  getUserOrganizationRequests,
};
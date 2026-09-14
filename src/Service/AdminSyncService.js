const axios = require("axios");

const syncUserToAdmin = async (user) => {
  try {
    const ADMIN_API_URL = process.env.ADMIN_API_URL;

    if (!ADMIN_API_URL) {
      console.error(
        "❌ ADMIN_API_URL is not defined in .env"
      );

      return {
        success: false,
        message: "ADMIN_API_URL is not defined",
      };
    }

    if (!user || !user._id) {
      console.error(
        "❌ User ID is missing"
      );

      return {
        success: false,
        message: "User ID is missing",
      };
    }

    // Password intentionally NOT sent
    const userData = {
      _id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      role: user.role || "user",
    };

    console.log(
      "===================================="
    );

    console.log(
      "🔄 SYNCING USER TO ADMIN"
    );

    console.log(
      "User:",
      userData.email
    );

    console.log(
      "Admin URL:",
      ADMIN_API_URL
    );

    console.log(
      "===================================="
    );

    const response = await axios.post(
      `${ADMIN_API_URL}/admin/sync-user`,
      userData,
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(
      "✅ ADMIN SYNC SUCCESS:",
      response.data
    );

    return {
      success: true,
      message: "User synced to Admin successfully",
      data: response.data,
    };

  } catch (error) {

    console.error(
      "❌ ADMIN SYNC ERROR:"
    );

    console.error(
      error.response?.data ||
      error.message
    );

    /*
      Important:
      Admin sync fail ஆனாலும்
      User login fail ஆகக்கூடாது.
    */

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message,
    };
  }
};

module.exports = {
  syncUserToAdmin,
};
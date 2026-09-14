const axios = require("axios");
const AdminUser = require("../Model/AdminUser");

// =====================================================
// SYNC USERS FROM USER PROJECT
// =====================================================

const syncUsersFromUserProject = async () => {
  try {
    const USER_API_URL = process.env.USER_API_URL;

    console.log("USER_API_URL:", USER_API_URL);

    if (!USER_API_URL) {
      throw new Error("USER_API_URL is not defined in .env");
    }

    // ==========================================
    // GET USERS FROM USER BACKEND
    // ==========================================

    const url = `${USER_API_URL}/login/getusers`;

    console.log("Calling User API:", url);

    const response = await axios.get(url, {
      timeout: 15000,
    });

    console.log("User API Status:", response.status);
    console.log("User API Response:", response.data);

    // ==========================================
    // GET USER ARRAY
    // ==========================================

    let users = [];

    if (Array.isArray(response.data)) {
      users = response.data;
    } else if (Array.isArray(response.data.users)) {
      users = response.data.users;
    } else if (Array.isArray(response.data.data)) {
      users = response.data.data;
    } else if (Array.isArray(response.data.getuserdata)) {
      users = response.data.getuserdata;
    } else if (Array.isArray(response.data.getUsersData)) {
      users = response.data.getUsersData;
    }

    console.log("Users found:", users.length);

    if (!users.length) {
      return {
        success: false,
        message: "No users found from User API",
        count: 0,
      };
    }

    // ==========================================
    // SAVE USERS TO ADMIN DATABASE
    // ==========================================

    let inserted = 0;
    let updated = 0;

    for (const user of users) {
      if (!user._id) {
        console.log("Skipping user without _id:", user);
        continue;
      }

      const userData = {
        sourceUserId: user._id,
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        profileImage: user.profileImage || "",
        role: user.role || "user",
        source: "user-project",
      };

      const existingUser = await AdminUser.findOne({
        sourceUserId: user._id,
      });

      if (existingUser) {
        await AdminUser.updateOne(
          {
            sourceUserId: user._id,
          },
          {
            $set: userData,
          }
        );

        updated++;
      } else {
        await AdminUser.create(userData);
        inserted++;
      }
    }

    return {
      success: true,
      message: "Users synchronized successfully",
      total: users.length,
      inserted,
      updated,
    };

  } catch (error) {
    console.error("=================================");
    console.error("SYNC USERS ERROR");
    console.error("Message:", error.message);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response:", error.response.data);
    }

    if (error.request) {
      console.error("Request was sent but no response received");
    }

    console.error("=================================");

    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};


// =====================================================
// GET ADMIN USERS
// =====================================================

const getAdminUsers = async () => {
  try {
    const users = await AdminUser.find()
      .sort({
        createdAt: -1,
      })
      .lean();

    return {
      success: true,
      count: users.length,
      users,
    };

  } catch (error) {
    console.error("Get Admin Users Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};


module.exports = {
  syncUsersFromUserProject,
  getAdminUsers,
};
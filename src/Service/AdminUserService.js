const mongoose = require("mongoose");
const AdminUser = require("../Model/AdminUser");

// Reads directly from the shared "users" collection instead of calling an HTTP API.
// Change "users" below if your User Side's collection name is different.
const SourceUserSchema = new mongoose.Schema({}, { strict: false, collection: "users" });
const SourceUser = mongoose.models.SourceUser || mongoose.model("SourceUser", SourceUserSchema);

const syncUsersFromUserProject = async () => {
  try {
    const users = await SourceUser.find().lean();

    if (!users.length) {
      return { success: false, message: "No users found in the User collection", count: 0 };
    }

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const user of users) {
      if (!user._id) {
        skipped++;
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

      const existingUser = await AdminUser.findOne({ sourceUserId: user._id });

      if (existingUser) {
        await AdminUser.updateOne({ sourceUserId: user._id }, { $set: userData });
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
      skipped,
    };
  } catch (error) {
    console.error("SYNC USERS ERROR:", error.message);
    return { success: false, message: error.message };
  }
};

const getAdminUsers = async () => {
  try {
    const users = await AdminUser.find().sort({ createdAt: -1 }).lean();
    return { success: true, count: users.length, users };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getAdminUserById = async (id) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { success: false, message: "Invalid user ID" };
    }

    const user = await AdminUser.findById(id).lean();
    if (!user) {
      return { success: false, message: "User not found" };
    }

    return { success: true, user };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = { syncUsersFromUserProject, getAdminUsers, getAdminUserById };
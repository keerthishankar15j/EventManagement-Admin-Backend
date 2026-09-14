const bcrypt = require("bcrypt");
const Signup = require("../Model/Signup");

const {
  syncUserToAdmin,
} = require("./AdminSyncService");


// =====================================================
// LOGIN USER
// =====================================================

const loginUserdata = async (loginData) => {
  try {

    const { email, password } = loginData;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!email || !password) {
      return {
        success: false,
        message: "Email and password are required",
      };
    }


    // -----------------------------
    // FIND USER
    // -----------------------------

    const user = await Signup.findOne({
      email: email.toLowerCase().trim(),
    });


    if (!user) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }


    // -----------------------------
    // CHECK PASSWORD
    // -----------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.password
      );


    if (!passwordMatch) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }


    // =================================================
    // LOGIN SUCCESS
    // =================================================

    console.log(
      "===================================="
    );

    console.log(
      "✅ USER LOGIN SUCCESS"
    );

    console.log(
      "User:",
      user.email
    );

    console.log(
      "===================================="
    );


    // =================================================
    // SYNC USER TO ADMIN
    // =================================================

    /*
      User login successful ஆனதும்
      Admin MongoDB-க்கு user data அனுப்பப்படும்.

      Password Admin-க்கு போகாது.
    */

    const syncResult =
      await syncUserToAdmin(user);


    if (syncResult.success) {

      console.log(
        "✅ USER ADMIN DB SYNCED"
      );

    } else {

      console.log(
        "⚠️ ADMIN SYNC FAILED:"
      );

      console.log(
        syncResult.message
      );

    }


    // =================================================
    // USER RESPONSE
    // =================================================

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      bio: user.bio || "",
      profileImage:
        user.profileImage || "",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };


    return {
      success: true,
      message: "Login successful",
      user: userResponse,
    };


  } catch (error) {

    console.error(
      "LOGIN SERVICE ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


// =====================================================
// GET ALL USERS
// =====================================================

const getUsersData = async () => {
  try {

    const users = await Signup.find()
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .lean();


    return {
      success: true,
      users,
    };


  } catch (error) {

    console.error(
      "GET USERS ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


// =====================================================
// GET SINGLE USER
// =====================================================

const getIndividualUserData = async (id) => {
  try {

    const user =
      await Signup.findById(id)
        .select("-password")
        .lean();


    if (!user) {

      return {
        success: false,
        message: "User not found",
      };

    }


    return {
      success: true,
      user,
    };


  } catch (error) {

    console.error(
      "GET INDIVIDUAL USER ERROR:",
      error.message
    );

    return {
      success: false,
      message: error.message,
    };
  }
};


// =====================================================
// EXPORT
// =====================================================

module.exports = {
  loginUserdata,
  getUsersData,
  getIndividualUserData,
};
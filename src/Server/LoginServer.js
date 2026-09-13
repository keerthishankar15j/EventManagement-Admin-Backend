const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken"); 
 
const SignupModel = require("../Model/SignupModel"); 
const LoginHistoryModel = require("../Model/LoginHistoryModel"); 
 
 
// =============================== 
// LOGIN USER 
// =============================== 
const loginUserdata = async (data) => { 
  try { 
    const { email, password } = data; 
 
    if (!email || !password) { 
      return { 
        success: false, 
        message: "Email and password are required", 
      }; 
    } 
 
    const user = await SignupModel.findOne({ 
      email: email.toLowerCase().trim(), 
    }); 
 
    if (!user) { 
      return { 
        success: false, 
        message: "Invalid email or password", 
      }; 
    } 
 
    const isPasswordCorrect = await bcrypt.compare( 
      password, 
      user.password 
    ); 
 
    if (!isPasswordCorrect) { 
      return { 
        success: false, 
        message: "Invalid email or password", 
      }; 
    } 
 
    const token = jwt.sign( 
      { 
        id: user._id, 
        email: user.email, 
        role: user.role, 
      }, 
      process.env.JWT_SECRET || "XH1KSP_VDM", 
      { 
        expiresIn: "1d", 
      } 
    ); 
 
    // Create login history 
    await LoginHistoryModel.create({ 
      userId: user._id, 
      name: user.name, 
      email: user.email, 
      loginTime: new Date(), 
      logoutTime: null, 
      status: "Active", 
    }); 
 
    return { 
      success: true, 
      message: "Login successful", 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role, 
        phone: user.phone || "", 
        bio: user.bio || "", 
        profileImage: user.profileImage || "", 
      }, 
    }; 
 
  } catch (error) { 
    console.error("Login Server Error:", error); 
 
    throw error; 
  } 
}; 
 
 
// =============================== 
// GET ALL USERS 
// =============================== 
const getUsersData = async () => { 
  try { 
    const users = await SignupModel.find() 
      .select("-password") 
      .sort({ createdAt: -1 }); 
 
    return { 
      success: true, 
      data: users, 
    }; 
 
  } catch (error) { 
    console.error("Get Users Error:", error); 
 
    throw error; 
  } 
}; 
 
 
// =============================== 
// GET INDIVIDUAL USER 
// =============================== 
const getIndividualUserData = async (id) => { 
  try { 
    const user = await SignupModel.findById(id) 
      .select("-password"); 
 
    if (!user) { 
      return { 
        success: false, 
        message: "User not found", 
      }; 
    } 
 
    return { 
      success: true, 
      data: user, 
    }; 
 
  } catch (error) { 
    console.error("Get Individual User Error:", error); 
 
    throw error; 
  } 
}; 
 
 
module.exports = { 
  loginUserdata, 
  getUsersData, 
  getIndividualUserData, 
};
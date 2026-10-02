const UserModel = require("../Model/UserModel");

const {
  sendLoginSuccessEmail
} = require("../Services/EmailService");


const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;


    const user = await UserModel.findOne({
      email: email
    });


    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }


    if (user.password !== password) {

      return res.status(401).json({
        success: false,
        message: "Invalid password"
      });

    }


    // =========================================
    // LOGIN SUCCESS
    // =========================================

    await sendLoginSuccessEmail(
      user.email,
      user.name
    );


    return res.status(200).json({

      success: true,

      message: "Login successful",

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: "Login failed"

    });

  }
};


module.exports = {
  loginUser
};
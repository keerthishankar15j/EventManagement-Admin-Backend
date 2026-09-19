require("dotenv").config();

const {
  sendLoginSuccessEmail,
} = require("./src/Server/EmailService");

const testEmail = async () => {
  try {
    await sendLoginSuccessEmail(
      "keerthigajayashankar5@gmail.com",
      "Keerthi"
    );

    console.log("Test email sent successfully!");

  } catch (error) {
    console.log("Email error:", error.message);
  }
};

testEmail();
const nodemailer = require("nodemailer"); 
 
const transporter = nodemailer.createTransport({ 
  service: "gmail", 
 
  auth: { 
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  }, 
}); 
 
 
const sendWelcomeEmail = async (name, email) => { 
 
  await transporter.sendMail({ 
 
    from: `"Eventora Event Management" <${process.env.EMAIL_USER}>`, 
 
    to: email, 
 
    subject: "Welcome to Eventora 🎉", 
 
    html: ` 
      <div style=" 
        font-family: Arial, sans-serif; 
        max-width: 600px; 
        margin: auto; 
        padding: 30px; 
        background: #f5f3ff; 
        border-radius: 15px; 
      "> 
 
        <h1 style="color:#6c3bff;"> 
          Welcome to Eventora 🎉 
        </h1> 
 
        <p style="font-size:18px;"> 
          Hello <strong>${name}</strong>, 
        </p> 
 
        <p> 
          Your account has been successfully registered 
          in our Event Management System. 
        </p> 
 
        <p> 
          You can now explore events, view event details 
          and manage your event activities. 
        </p> 
 
        <div style=" 
          margin-top:25px; 
          padding:15px; 
          background:white; 
          border-radius:10px; 
        "> 
          <strong>Eventora Event Management</strong> 
          <br /> 
          Your events. Your experience. Your journey. 
        </div> 
 
        <p style=" 
          margin-top:25px; 
          color:#777; 
        "> 
          Thank you for joining us! ❤️ 
        </p> 
 
      </div> 
    `, 
 
  }); 
 
  console.log( 
    `Welcome email sent to ${email}` 
  ); 
}; 
 
 
module.exports = { 
  sendWelcomeEmail, 
};
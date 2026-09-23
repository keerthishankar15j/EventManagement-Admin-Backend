
const nodemailer = require("nodemailer");

// ==========================================
// EMAIL TRANSPORTER
// ==========================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// ==========================================
// 1. LOGIN SUCCESSFUL EMAIL
// ==========================================

const sendLoginSuccessEmail = async (email, name) => {
  try {
    await transporter.sendMail({
      from: `"Event Management" <${process.env.EMAIL_USER}>`,
      to: email,

      subject: "Login Successful - Event Management",

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2 style="color: #6c3bff;">
            Login Successful
          </h2>

          <p>Hello ${name},</p>

          <p>
            You have successfully logged in to
            the Event Management System.
          </p>

          <p>
            Thank you for using our platform.
          </p>

          <br>

          <p>Regards,</p>
          <p><b>Event Management Team</b></p>

        </div>
      `,
    });

    console.log("Login success email sent");

  } catch (error) {
    console.error("Login email error:", error.message);
  }
};

// ==========================================
// 2. MESSAGE REQUEST EMAIL
// ==========================================

const sendMessageRequestEmail = async (
  email,
  name,
  message
) => {
  try {
    await transporter.sendMail({
      from: `"Event Management" <${process.env.EMAIL_USER}>`,
      to: email,

      subject: "Message Request Received",

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2 style="color: #6c3bff;">
            Message Request Received
          </h2>

          <p>Hello ${name},</p>

          <p>
            We have successfully received your message request.
          </p>

          <h3>Your Message:</h3>

          <p>
            ${message}
          </p>

          <p>
            Our team will review your request
            and get back to you soon.
          </p>

          <br>

          <p>Regards,</p>
          <p><b>Event Management Team</b></p>

        </div>
      `,
    });

    console.log("Message request email sent");

  } catch (error) {
    console.error("Message email error:", error.message);
  }
};

// ==========================================
// 3. ORGANIZATION REQUEST EMAIL
// ==========================================

const sendOrganizationRequestEmail = async (
  email,
  name,
  organizationName
) => {
  try {
    await transporter.sendMail({
      from: `"Event Management" <${process.env.EMAIL_USER}>`,
      to: email,

      subject: "Organization Request Received",

      html: `
        <div style="font-family: Arial; padding: 20px;">

          <h2 style="color: #6c3bff;">
            Organization Request Received
          </h2>

          <p>Hello ${name},</p>

          <p>
            Your organization request has been
            successfully submitted.
          </p>

          <h3>Organization Name:</h3>

          <p>
            ${organizationName}
          </p>

          <p>
            Our team will review your request
            and contact you soon.
          </p>

          <br>

          <p>Regards,</p>
          <p><b>Event Management Team</b></p>

        </div>
      `,
    });

    console.log("Organization request email sent");

  } catch (error) {
    console.error(
      "Organization email error:",
      error.message
    );
  }
};

// ==========================================
// EXPORT ALL EMAIL FUNCTIONS
// ==========================================

module.exports = {
  sendLoginSuccessEmail,
  sendMessageRequestEmail,
  sendOrganizationRequestEmail,
};
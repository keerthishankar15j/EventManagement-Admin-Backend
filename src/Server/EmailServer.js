const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// 1. LOGIN SUCCESS EMAIL
// =====================================================

const sendLoginSuccessEmail = async (userEmail, userName) => {
  try {
    const mailOptions = {
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: userEmail,

      subject: "Login Successful - Eventora",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="color:#6C3BFF;">
            Welcome to Eventora 🎉
          </h2>

          <p>Hello <b>${userName}</b>,</p>

          <p>
            You have successfully logged in to your Eventora account.
          </p>

          <p>
            You can now explore upcoming events, book events,
            and manage your event activities.
          </p>

          <br>

          <p>
            Thank you for using <b>Eventora</b>.
          </p>

          <p>
            Regards,<br>
            <b>Eventora Team</b>
          </p>

        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Login success email sent:", result.messageId);

    return true;

  } catch (error) {
    console.log("Login email error:", error.message);

    return false;
  }
};


// =====================================================
// 2. ADMIN REPLY EMAIL
// =====================================================

const sendAdminReplyEmail = async (
  userEmail,
  userName,
  originalMessage,
  adminReply
) => {
  try {

    const mailOptions = {

      from: `"Eventora Admin" <${process.env.EMAIL_USER}>`,

      to: userEmail,

      subject: "Reply from Eventora Admin",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="color:#6C3BFF;">
            Eventora Admin Reply
          </h2>

          <p>Hello <b>${userName}</b>,</p>

          <p>
            The Eventora Admin has replied to your query.
          </p>

          <hr>

          <h3>Your Query</h3>

          <div style="
            background:#f5f5f5;
            padding:15px;
            border-radius:8px;
          ">
            ${originalMessage}
          </div>

          <br>

          <h3>Admin Reply</h3>

          <div style="
            background:#eee8ff;
            padding:15px;
            border-radius:8px;
          ">
            ${adminReply}
          </div>

          <br>

          <p>
            If you have any further questions, feel free to contact
            the Eventora Admin.
          </p>

          <p>
            Regards,<br>
            <b>Eventora Admin Team</b>
          </p>

        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log("Admin reply email sent:", result.messageId);

    return true;

  } catch (error) {

    console.log("Admin reply email error:", error.message);

    return false;
  }
};


// =====================================================
// 3. ORGANIZER APPROVE / REJECT EMAIL
// =====================================================

const sendOrganizerStatusEmail = async (
  organizerEmail,
  organizerName,
  eventName,
  status,
  adminMessage = ""
) => {

  try {

    let subject = "";

    let title = "";

    let statusColor = "";

    if (status === "Approved") {

      subject = `Event Request Approved - ${eventName}`;

      title = "Your Event Request Has Been Approved 🎉";

      statusColor = "#16a34a";

    } else {

      subject = `Event Request Rejected - ${eventName}`;

      title = "Your Event Request Has Been Rejected";

      statusColor = "#dc2626";
    }


    const mailOptions = {

      from: `"Eventora Admin" <${process.env.EMAIL_USER}>`,

      to: organizerEmail,

      subject: subject,

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 650px;
          margin: auto;
          padding: 30px;
          border: 1px solid #ddd;
          border-radius: 10px;
        ">

          <h2 style="color:${statusColor};">
            ${title}
          </h2>

          <p>Hello <b>${organizerName}</b>,</p>

          <p>
            Your event request has been reviewed by the Eventora Admin.
          </p>

          <div style="
            background:#f5f5f5;
            padding:20px;
            border-radius:8px;
          ">

            <p>
              <b>Event Name:</b> ${eventName}
            </p>

            <p>
              <b>Status:</b>

              <span style="
                color:${statusColor};
                font-weight:bold;
              ">
                ${status}
              </span>
            </p>

          </div>

          ${
            adminMessage
              ? `
                <br>

                <h3>Admin Message</h3>

                <div style="
                  background:#eee8ff;
                  padding:15px;
                  border-radius:8px;
                ">
                  ${adminMessage}
                </div>
              `
              : ""
          }

          <br>

          ${
            status === "Approved"
              ? `
                <p>
                  Congratulations! Your event request has been approved.
                  You can continue with the next steps from your account.
                </p>
              `
              : `
                <p>
                  Your event request was not approved at this time.
                  Please check the admin message for more information.
                </p>
              `
          }

          <p>
            Regards,<br>
            <b>Eventora Admin Team</b>
          </p>

        </div>
      `,
    };


    const result = await transporter.sendMail(mailOptions);

    console.log(
      "Organizer status email sent:",
      result.messageId
    );

    return true;

  } catch (error) {

    console.log(
      "Organizer status email error:",
      error.message
    );

    return false;
  }
};


module.exports = {
  sendLoginSuccessEmail,
  sendAdminReplyEmail,
  sendOrganizerStatusEmail,
};
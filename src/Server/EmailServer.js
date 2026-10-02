
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// VERIFY EMAIL CONNECTION
// =====================================================

const verifyEmailConnection = async () => {
  try {
    await transporter.verify();

    console.log("Email service is ready");

    return true;
  } catch (error) {
    console.log(
      "Email connection error:",
      error.message
    );

    return false;
  }
};

// =====================================================
// LOGIN SUCCESS EMAIL
// =====================================================

const sendLoginSuccessEmail = async (
  userEmail,
  userName
) => {
  try {
    const mailOptions = {
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Login Successful - Eventora",

      html: `
        <h2>Welcome to Eventora!</h2>

        <p>Hello <b>${userName}</b>,</p>

        <p>
          Your login was successful.
        </p>

        <p>
          You can now explore many exciting events
          on Eventora.
        </p>

        <br>

        <p>
          Regards,<br>
          <b>Eventora Team</b>
        </p>
      `,
    };

    const result =
      await transporter.sendMail(mailOptions);

    console.log(
      "Login success email sent:",
      result.messageId
    );

    return true;

  } catch (error) {

    console.log(
      "Login email error:",
      error.message
    );

    return false;
  }
};

// =====================================================
// ADMIN REPLY EMAIL
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
        <div
          style="
            font-family: Arial;
            max-width: 650px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          "
        >

          <h2>Eventora Admin Reply</h2>

          <p>
            Hello <b>${userName}</b>,
          </p>

          <p>
            <b>Your Message:</b>
          </p>

          <p>
            ${originalMessage}
          </p>

          <hr>

          <p>
            <b>Admin Reply:</b>
          </p>

          <p>
            ${adminReply}
          </p>

          <br>

          <p>
            Regards,<br>
            <b>Eventora Admin Team</b>
          </p>

        </div>
      `,
    };

    const result =
      await transporter.sendMail(mailOptions);

    console.log(
      "Admin reply email sent:",
      result.messageId
    );

    return true;

  } catch (error) {

    console.log(
      "Admin reply email error:",
      error.message
    );

    return false;
  }
};

// =====================================================
// ORGANIZER APPROVE / REJECT EMAIL
// =====================================================

const sendOrganizerStatusEmail = async (
  organizerEmail,
  organizerName,
  eventName,
  status,
  adminMessage = ""
) => {

  try {

    console.log(
      "Preparing organizer email..."
    );

    console.log(
      "To:",
      organizerEmail
    );

    console.log(
      "Name:",
      organizerName
    );

    console.log(
      "Event:",
      eventName
    );

    console.log(
      "Status:",
      status
    );

    let subject;
    let title;
    let statusColor;

    if (status === "Approved") {

      subject =
        `Event Request Approved - ${eventName}`;

      title =
        "Your Event Request Has Been Approved 🎉";

      statusColor = "#16a34a";

    } else {

      subject =
        `Event Request Rejected - ${eventName}`;

      title =
        "Your Event Request Has Been Rejected";

      statusColor = "#dc2626";
    }

    const mailOptions = {

      from:
        `"Eventora Admin" <${process.env.EMAIL_USER}>`,

      to: organizerEmail,

      subject: subject,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 10px;
          "
        >

          <h2
            style="
              color:${statusColor};
            "
          >
            ${title}
          </h2>

          <p>
            Hello <b>${organizerName}</b>,
          </p>

          <p>
            Your event request has been reviewed
            by the Eventora Admin.
          </p>

          <div
            style="
              background:#f5f5f5;
              padding:20px;
              border-radius:8px;
            "
          >

            <p>
              <b>Event Name:</b>
              ${eventName}
            </p>

            <p>
              <b>Status:</b>

              <span
                style="
                  color:${statusColor};
                  font-weight:bold;
                "
              >
                ${status}
              </span>
            </p>

          </div>

          ${
            adminMessage
              ? `
                <br>

                <h3>
                  Admin Message
                </h3>

                <div
                  style="
                    background:#eee8ff;
                    padding:15px;
                    border-radius:8px;
                  "
                >
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
                  Congratulations!
                  Your event request has been approved.
                </p>
              `
              : `
                <p>
                  Your event request was not approved
                  at this time.
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

    console.log(
      "Sending organizer email..."
    );

    const result =
      await transporter.sendMail(mailOptions);

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

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  verifyEmailConnection,
  sendLoginSuccessEmail,
  sendAdminReplyEmail,
  sendOrganizerStatusEmail,
};

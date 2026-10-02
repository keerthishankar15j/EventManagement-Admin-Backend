
const nodemailer = require("nodemailer");

// =====================================================
// EMAIL TRANSPORTER
// =====================================================

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
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 12px;
            background: #ffffff;
          "
        >

          <h2 style="color:#6C3BFF;">
            Welcome to Eventora!
          </h2>

          <p>
            Hello <b>${userName}</b>,
          </p>

          <p>
            Your login was successful.
          </p>

          <p>
            You can now explore many exciting
            events on Eventora.
          </p>

          <br>

          <p>
            Regards,<br>
            <b>Eventora Team</b>
          </p>

        </div>
      `,
    };

    const result =
      await transporter.sendMail(
        mailOptions
      );

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
      from:
        `"Eventora Admin" <${process.env.EMAIL_USER}>`,

      to: userEmail,

      subject:
        "Reply from Eventora Admin",

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 650px;
            margin: auto;
            padding: 30px;
            border: 1px solid #ddd;
            border-radius: 12px;
            background: #ffffff;
          "
        >

          <h2 style="color:#6C3BFF;">
            Eventora Admin Reply
          </h2>

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
      await transporter.sendMail(
        mailOptions
      );

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
            border-radius: 12px;
            background: #ffffff;
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
      await transporter.sendMail(
        mailOptions
      );

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
// BOOKING CONFIRMATION EMAIL
// =====================================================

const sendBookingConfirmationEmail = async (
  userEmail,
  userName,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  numberOfTickets,
  ticketPrice,
  totalAmount,
  bookingId
) => {

  try {

    console.log(
      "Preparing booking confirmation email..."
    );

    console.log(
      "To:",
      userEmail
    );

    console.log(
      "User:",
      userName
    );

    console.log(
      "Event:",
      eventName
    );

    // -------------------------------------------------
    // FORMAT EVENT DATE
    // -------------------------------------------------

    let formattedDate = "-";

    if (eventDate) {

      formattedDate =
        new Date(
          eventDate
        ).toLocaleDateString(
          "en-IN",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        );
    }

    // -------------------------------------------------
    // FORMAT AMOUNTS
    // -------------------------------------------------

    const formattedTicketPrice =
      Number(ticketPrice || 0)
        .toLocaleString("en-IN");

    const formattedTotalAmount =
      Number(totalAmount || 0)
        .toLocaleString("en-IN");

    // -------------------------------------------------
    // EMAIL
    // -------------------------------------------------

    const mailOptions = {

      from:
        `"Eventora" <${process.env.EMAIL_USER}>`,

      to: userEmail,

      subject:
        `Booking Confirmed - ${eventName}`,

      html: `
        <div
          style="
            font-family: Arial, sans-serif;
            max-width: 680px;
            margin: auto;
            background: #f7f5f0;
            padding: 30px;
          "
        >

          <!-- HEADER -->

          <div
            style="
              background: linear-gradient(
                135deg,
                #0B1020,
                #6C3BFF
              );
              padding: 28px;
              border-radius: 14px 14px 0 0;
              text-align: center;
              color: white;
            "
          >

            <h1
              style="
                margin: 0;
                font-size: 28px;
              "
            >
              Eventora
            </h1>

            <p
              style="
                margin: 8px 0 0;
                font-size: 15px;
              "
            >
              Event Booking Confirmation
            </p>

          </div>

          <!-- CONTENT -->

          <div
            style="
              background: white;
              padding: 30px;
              border-radius: 0 0 14px 14px;
            "
          >

            <h2
              style="
                color: #16a34a;
                margin-top: 0;
              "
            >
              ✓ Booking Confirmed
            </h2>

            <p>
              Hello <b>${userName}</b>,
            </p>

            <p>
              Your booking has been successfully
              confirmed on Eventora.
            </p>

            <!-- EVENT DETAILS -->

            <div
              style="
                margin-top: 25px;
                padding: 20px;
                background: #f5f5f5;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #6C3BFF;
                "
              >
                Event Details
              </h3>

              <p>
                <b>Event:</b>
                ${eventName}
              </p>

              <p>
                <b>Date:</b>
                ${formattedDate}
              </p>

              <p>
                <b>Time:</b>
                ${eventTime || "-"}
              </p>

              <p>
                <b>Location:</b>
                ${eventLocation || "-"}
              </p>

            </div>

            <!-- BOOKING DETAILS -->

            <div
              style="
                margin-top: 20px;
                padding: 20px;
                background: #eee8ff;
                border-radius: 10px;
              "
            >

              <h3
                style="
                  margin-top: 0;
                  color: #6C3BFF;
                "
              >
                Booking Details
              </h3>

              <p>
                <b>Booking ID:</b>
                ${bookingId || "-"}
              </p>

              <p>
                <b>Number of Tickets:</b>
                ${numberOfTickets}
              </p>

              <p>
                <b>Ticket Price:</b>
                ₹${formattedTicketPrice}
              </p>

              <hr>

              <p
                style="
                  font-size: 18px;
                  margin-bottom: 0;
                "
              >
                <b>Total Amount:</b>

                <span
                  style="
                    color:#6C3BFF;
                    font-weight:bold;
                  "
                >
                  ₹${formattedTotalAmount}
                </span>
              </p>

            </div>

            <!-- STATUS -->

            <div
              style="
                margin-top: 25px;
                text-align: center;
                padding: 15px;
                background: #dcfce7;
                border-radius: 8px;
              "
            >

              <strong
                style="
                  color:#15803d;
                "
              >
                Booking Status: Confirmed
              </strong>

            </div>

            <br>

            <p>
              Thank you for choosing Eventora.
              We hope you have a great experience
              at the event!
            </p>

            <p>
              Regards,<br>
              <b>Eventora Team</b>
            </p>

          </div>

        </div>
      `,
    };

    // -------------------------------------------------
    // SEND EMAIL
    // -------------------------------------------------

    console.log(
      "Sending booking confirmation email..."
    );

    const result =
      await transporter.sendMail(
        mailOptions
      );

    console.log(
      "Booking confirmation email sent:",
      result.messageId
    );

    return true;

  } catch (error) {

    console.log(
      "Booking confirmation email error:",
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

  sendBookingConfirmationEmail,

};

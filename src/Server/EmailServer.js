const nodemailer = require("nodemailer");

// =====================================================
// GMAIL TRANSPORTER
// =====================================================

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// =====================================================
// COMMON EMAIL FUNCTION
// =====================================================

const sendEmail = async ({
  to,
  subject,
  html,
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"Eventora" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: subject,
      html: html,
    });

    console.log("EMAIL SENT SUCCESSFULLY");
    console.log("To:", to);
    console.log("Message ID:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error(
      "EMAIL SEND ERROR:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// =====================================================
// 1. LOGIN SUCCESS EMAIL
// =====================================================

const sendLoginSuccessEmail = async (
  userEmail,
  userName
) => {
  try {
    const html = `
      <!DOCTYPE html>

      <html>
      <body
        style="
          margin:0;
          padding:0;
          background:#f7f5f0;
          font-family:Arial,sans-serif;
        "
      >

        <div
          style="
            max-width:600px;
            margin:40px auto;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 8px 30px rgba(0,0,0,0.08);
          "
        >

          <!-- HEADER -->

          <div
            style="
              background:#0b1020;
              padding:30px;
              text-align:center;
            "
          >

            <h1
              style="
                margin:0;
                color:#ffffff;
                font-size:28px;
              "
            >
              EVENTORA
            </h1>

            <p
              style="
                color:#cccccc;
                margin:8px 0 0;
              "
            >
              Welcome Back
            </p>

          </div>


          <!-- CONTENT -->

          <div style="padding:30px;">

            <h2
              style="
                color:#0b1020;
                margin-top:0;
              "
            >
              Login Successful 🎉
            </h2>

            <p
              style="
                color:#555;
                font-size:15px;
                line-height:1.6;
              "
            >
              Hi <strong>${userName}</strong>,
            </p>

            <p
              style="
                color:#555;
                font-size:15px;
                line-height:1.6;
              "
            >
              You have successfully logged in to your
              Eventora account.
            </p>

            <div
              style="
                margin-top:25px;
                padding:20px;
                background:#f1edff;
                border-radius:12px;
              "
            >

              <p
                style="
                  margin:0;
                  color:#555;
                  line-height:1.6;
                "
              >
                You can now explore events, book tickets,
                manage your bookings and discover exciting
                experiences on Eventora.
              </p>

            </div>

            <p
              style="
                margin-top:25px;
                color:#777;
                font-size:13px;
              "
            >
              If this login was not made by you, please
              secure your account immediately.
            </p>

          </div>


          <!-- FOOTER -->

          <div
            style="
              background:#0b1020;
              padding:18px;
              text-align:center;
            "
          >

            <p
              style="
                margin:0;
                color:#ffffff;
                font-size:13px;
              "
            >
              Welcome to Eventora.
            </p>

          </div>

        </div>

      </body>
      </html>
    `;

    return await sendEmail({
      to: userEmail,
      subject: "Login Successful - Welcome to Eventora",
      html: html,
    });

  } catch (error) {
    console.error(
      "LOGIN EMAIL ERROR:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// =====================================================
// 2. ADMIN MESSAGE REPLY EMAIL
// =====================================================

const sendAdminReplyEmail = async (
  userEmail,
  userName,
  originalMessage,
  adminReply
) => {
  try {
    const html = `
      <!DOCTYPE html>

      <html>
      <body
        style="
          margin:0;
          padding:0;
          background:#f7f5f0;
          font-family:Arial,sans-serif;
        "
      >

        <div
          style="
            max-width:650px;
            margin:40px auto;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 8px 30px rgba(0,0,0,0.08);
          "
        >

          <!-- HEADER -->

          <div
            style="
              background:#0b1020;
              padding:30px;
              text-align:center;
            "
          >

            <h1
              style="
                margin:0;
                color:#ffffff;
                font-size:28px;
              "
            >
              EVENTORA
            </h1>

            <p
              style="
                color:#cccccc;
                margin:8px 0 0;
              "
            >
              Message Response
            </p>

          </div>


          <!-- CONTENT -->

          <div style="padding:30px;">

            <h2
              style="
                color:#0b1020;
                margin-top:0;
              "
            >
              Admin Replied to Your Message
            </h2>

            <p
              style="
                color:#555;
                font-size:15px;
              "
            >
              Hi <strong>${userName}</strong>,
            </p>

            <p
              style="
                color:#555;
                font-size:15px;
                line-height:1.6;
              "
            >
              The Eventora admin team has replied to
              your message.
            </p>


            <!-- ORIGINAL MESSAGE -->

            <div
              style="
                margin-top:20px;
                padding:18px;
                background:#f7f7f7;
                border-radius:12px;
                border-left:4px solid #999;
              "
            >

              <h4
                style="
                  margin-top:0;
                  color:#555;
                "
              >
                Your Message
              </h4>

              <p
                style="
                  margin-bottom:0;
                  color:#555;
                  line-height:1.6;
                "
              >
                ${originalMessage}
              </p>

            </div>


            <!-- ADMIN REPLY -->

            <div
              style="
                margin-top:20px;
                padding:18px;
                background:#f1edff;
                border-radius:12px;
                border-left:4px solid #6c3bff;
              "
            >

              <h4
                style="
                  margin-top:0;
                  color:#6c3bff;
                "
              >
                Admin Reply
              </h4>

              <p
                style="
                  margin-bottom:0;
                  color:#444;
                  line-height:1.6;
                "
              >
                ${adminReply}
              </p>

            </div>

          </div>


          <!-- FOOTER -->

          <div
            style="
              background:#0b1020;
              padding:18px;
              text-align:center;
            "
          >

            <p
              style="
                margin:0;
                color:#ffffff;
                font-size:13px;
              "
            >
              Eventora Admin Team
            </p>

          </div>

        </div>

      </body>
      </html>
    `;

    return await sendEmail({
      to: userEmail,
      subject: "Reply from Eventora Admin",
      html: html,
    });

  } catch (error) {
    console.error(
      "ADMIN REPLY EMAIL ERROR:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// =====================================================
// 3. ORGANIZER REQUEST ACCEPTED EMAIL
// =====================================================

const sendOrganizerAcceptedEmail = async (
  userEmail,
  userName,
  eventName
) => {
  try {
    const html = `
      <!DOCTYPE html>

      <html>
      <body
        style="
          margin:0;
          padding:0;
          background:#f7f5f0;
          font-family:Arial,sans-serif;
        "
      >

        <div
          style="
            max-width:650px;
            margin:40px auto;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 8px 30px rgba(0,0,0,0.08);
          "
        >

          <!-- HEADER -->

          <div
            style="
              background:#0b1020;
              padding:30px;
              text-align:center;
            "
          >

            <h1
              style="
                margin:0;
                color:#ffffff;
                font-size:28px;
              "
            >
              EVENTORA
            </h1>

            <p
              style="
                color:#cccccc;
                margin:8px 0 0;
              "
            >
              Organizer Request
            </p>

          </div>


          <!-- CONTENT -->

          <div style="padding:30px;">

            <h2
              style="
                color:#198754;
                margin-top:0;
              "
            >
              Organizer Request Accepted 🎉
            </h2>

            <p
              style="
                color:#555;
                font-size:15px;
              "
            >
              Hi <strong>${userName}</strong>,
            </p>

            <p
              style="
                color:#555;
                font-size:15px;
                line-height:1.6;
              "
            >
              Your organizer request has been accepted
              by the Eventora admin team.
            </p>

            <div
              style="
                margin-top:25px;
                padding:20px;
                background:#e8f8ef;
                border-radius:12px;
              "
            >

              <p
                style="
                  margin:0;
                  color:#333;
                  font-size:15px;
                "
              >
                <strong>Event:</strong>
                ${eventName}
              </p>

            </div>

            <p
              style="
                margin-top:25px;
                color:#555;
                line-height:1.6;
              "
            >
              You can now continue managing your event
              through your organizer account.
            </p>

          </div>


          <!-- FOOTER -->

          <div
            style="
              background:#0b1020;
              padding:18px;
              text-align:center;
            "
          >

            <p
              style="
                margin:0;
                color:#ffffff;
                font-size:13px;
              "
            >
              Eventora Admin Team
            </p>

          </div>

        </div>

      </body>
      </html>
    `;

    return await sendEmail({
      to: userEmail,
      subject:
        "Organizer Request Accepted - Eventora",
      html: html,
    });

  } catch (error) {
    console.error(
      "ORGANIZER EMAIL ERROR:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// =====================================================
// 4. BOOKING CONFIRMATION EMAIL
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
    let formattedDate = "N/A";

    if (eventDate) {
      formattedDate = new Date(
        eventDate
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    }

    const html = `
      <!DOCTYPE html>

      <html>
      <body
        style="
          margin:0;
          padding:0;
          background:#f7f5f0;
          font-family:Arial,sans-serif;
        "
      >

        <div
          style="
            max-width:650px;
            margin:40px auto;
            background:#ffffff;
            border-radius:16px;
            overflow:hidden;
            box-shadow:0 8px 30px rgba(0,0,0,0.08);
          "
        >

          <!-- HEADER -->

          <div
            style="
              background:#0b1020;
              padding:30px;
              text-align:center;
            "
          >

            <h1
              style="
                margin:0;
                color:#ffffff;
                font-size:28px;
              "
            >
              EVENTORA
            </h1>

            <p
              style="
                color:#cccccc;
                margin:8px 0 0;
              "
            >
              Booking Confirmation
            </p>

          </div>


          <!-- CONTENT -->

          <div style="padding:30px;">

            <h2
              style="
                color:#198754;
                margin-top:0;
              "
            >
              Booking Confirmed! 🎉
            </h2>

            <p
              style="
                color:#555;
                font-size:15px;
              "
            >
              Hi <strong>${userName}</strong>,
            </p>

            <p
              style="
                color:#555;
                line-height:1.6;
              "
            >
              Your event booking has been successfully
              confirmed.
            </p>


            <!-- EVENT DETAILS -->

            <div
              style="
                margin-top:20px;
                padding:20px;
                background:#f1edff;
                border-radius:12px;
              "
            >

              <h3
                style="
                  margin-top:0;
                  color:#6c3bff;
                "
              >
                Event Details
              </h3>

              <p>
                <strong>Event:</strong>
                ${eventName}
              </p>

              <p>
                <strong>Date:</strong>
                ${formattedDate}
              </p>

              <p>
                <strong>Time:</strong>
                ${eventTime || "N/A"}
              </p>

              <p>
                <strong>Location:</strong>
                ${eventLocation || "N/A"}
              </p>

            </div>


            <!-- TICKET DETAILS -->

            <div
              style="
                margin-top:20px;
                padding:20px;
                border:1px solid #eeeeee;
                border-radius:12px;
              "
            >

              <h3
                style="
                  margin-top:0;
                  color:#6c3bff;
                "
              >
                Ticket Details
              </h3>

              <p>
                <strong>Tickets:</strong>
                ${numberOfTickets}
              </p>

              <p>
                <strong>Ticket Price:</strong>
                ₹${ticketPrice}
              </p>

              <p>
                <strong>Total Amount:</strong>
                ₹${totalAmount}
              </p>

            </div>


            <!-- BOOKING ID -->

            <div
              style="
                margin-top:20px;
                padding:15px;
                background:#f7f5f0;
                border-radius:10px;
              "
            >

              <p
                style="
                  margin:0;
                  font-size:13px;
                  color:#555;
                "
              >
                <strong>Booking ID:</strong>
                ${bookingId}
              </p>

            </div>

          </div>


          <!-- FOOTER -->

          <div
            style="
              background:#0b1020;
              padding:18px;
              text-align:center;
            "
          >

            <p
              style="
                margin:0;
                color:#ffffff;
                font-size:13px;
              "
            >
              Thank you for booking with Eventora.
            </p>

          </div>

        </div>

      </body>
      </html>
    `;

    return await sendEmail({
      to: userEmail,
      subject:
        `Booking Confirmed - ${eventName}`,
      html: html,
    });

  } catch (error) {
    console.error(
      "BOOKING EMAIL ERROR:",
      error.message
    );

    return {
      success: false,
      error: error.message,
    };
  }
};

// =====================================================
// EXPORT ALL EMAIL FUNCTIONS
// =====================================================

module.exports = {
  sendLoginSuccessEmail,
  sendAdminReplyEmail,
  sendOrganizerAcceptedEmail,
  sendBookingConfirmationEmail,
};
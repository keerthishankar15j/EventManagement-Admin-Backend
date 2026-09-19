const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendLoginSuccessEmail = async (userEmail, userName) => {

  const mailOptions = {
    from: `"Event Management System" <${process.env.EMAIL_USER}>`,

    to: userEmail,

    subject: "Successfully Logged In - Event Management",

    html: `
      <!DOCTYPE html>

      <html>

      <head>

        <meta charset="UTF-8">

        <style>

          body {
            margin: 0;
            padding: 0;
            background: #f4f4f8;
            font-family: Arial, sans-serif;
          }

          .container {
            padding: 40px 15px;
          }

          .card {
            max-width: 600px;
            margin: auto;
            background: white;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          }

          .header {
            padding: 35px;
            text-align: center;
            color: white;

            background: linear-gradient(
              135deg,
              #6c3bff,
              #7c4dff,
              #ff654f
            );
          }

          .logo {
            font-size: 30px;
            font-weight: bold;
          }

          .header h1 {
            margin-top: 15px;
            margin-bottom: 0;
          }

          .content {
            padding: 35px;
            color: #333;
          }

          .content h2 {
            color: #17172b;
          }

          .login-box {
            margin-top: 25px;
            padding: 20px;

            background: #f7f5ff;

            border-left: 5px solid #6c3bff;

            border-radius: 10px;
          }

          .success {
            color: #16a34a;
            font-weight: bold;
          }

          .footer {
            padding: 20px;
            text-align: center;

            background: #fafafa;

            color: #777;

            font-size: 13px;
          }

        </style>

      </head>

      <body>

        <div class="container">

          <div class="card">

            <div class="header">

              <div class="logo">
                EVENTORA
              </div>

              <h1>
                Login Successful ✓
              </h1>

            </div>

            <div class="content">

              <h2>
                Hello ${userName} 👋
              </h2>

              <p>
                You have successfully logged in to the
                <strong>Event Management System</strong>.
              </p>

              <div class="login-box">

                <p>
                  <strong>Status:</strong>
                  <span class="success">
                    Successfully Logged In
                  </span>
                </p>

                <p>
                  <strong>Email:</strong>
                  ${userEmail}
                </p>

                <p>
                  <strong>Login Time:</strong>
                  ${new Date().toLocaleString("en-IN")}
                </p>

              </div>

              <p>
                Your login activity has been successfully
                recorded in the Event Management System.
              </p>

            </div>

            <div class="footer">

              © 2026 Event Management System.
              All rights reserved.

            </div>

          </div>

        </div>

      </body>

      </html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendLoginSuccessEmail,
};
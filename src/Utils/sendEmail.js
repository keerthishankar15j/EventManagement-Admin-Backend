const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendWelcomeEmail = async (user) => {
  const mailOptions = {
    from: `"Eventora Team" <${process.env.EMAIL_USER}>`,

    to: user.email,

    subject: "🎉 Welcome to Eventora – Login Successful!",

    html: `
      <div style="
        margin:0;
        padding:30px;
        background:#f4f4f8;
        font-family:Arial, sans-serif;
      ">

        <div style="
          max-width:650px;
          margin:auto;
          background:white;
          border-radius:18px;
          overflow:hidden;
          box-shadow:0 10px 30px rgba(0,0,0,0.10);
        ">

          <!-- Header -->

          <div style="
            background:linear-gradient(135deg,#6C3BFF,#8B5CF6);
            padding:35px;
            text-align:center;
            color:white;
          ">

            <h1 style="
              margin:0;
              font-size:32px;
            ">
              EVENTORA
            </h1>

            <p style="
              margin-top:10px;
              font-size:16px;
            ">
              Your Event Management Platform
            </p>

          </div>


          <!-- Content -->

          <div style="padding:35px;">

            <h2 style="
              color:#222;
              margin-top:0;
            ">
              Hello ${user.name}! 👋
            </h2>

            <p style="
              font-size:16px;
              color:#555;
              line-height:1.7;
            ">
              Welcome to <strong>Eventora</strong>!
              We're happy to let you know that you have
              successfully logged into your account.
            </p>


            <div style="
              background:#f5f3ff;
              border-left:5px solid #6C3BFF;
              padding:20px;
              border-radius:10px;
              margin:25px 0;
            ">

              <h3 style="
                margin-top:0;
                color:#6C3BFF;
              ">
                ✅ Login Successful
              </h3>

              <p style="
                margin-bottom:0;
                color:#555;
              ">
                Your account has been successfully authenticated.
                You can now continue exploring Eventora.
              </p>

            </div>


            <div style="
              background:#fafafa;
              padding:20px;
              border-radius:12px;
              margin-bottom:25px;
            ">

              <p style="margin:8px 0;">
                <strong>👤 Name:</strong> ${user.name}
              </p>

              <p style="margin:8px 0;">
                <strong>📧 Email:</strong> ${user.email}
              </p>

              <p style="margin:8px 0;">
                <strong>🕒 Login Time:</strong>
                ${new Date().toLocaleString()}
              </p>

            </div>


            <p style="
              color:#555;
              line-height:1.7;
            ">
              Thank you for being part of Eventora.
              We hope you have a great experience with us!
            </p>


            <div style="
              text-align:center;
              margin-top:30px;
            ">

              <span style="
                display:inline-block;
                background:#6C3BFF;
                color:white;
                padding:14px 28px;
                border-radius:8px;
                font-weight:bold;
              ">
                Welcome to Eventora 🚀
              </span>

            </div>

          </div>


          <!-- Footer -->

          <div style="
            background:#111827;
            color:#aaa;
            text-align:center;
            padding:20px;
            font-size:13px;
          ">

            <p style="margin:5px;">
              © 2026 Eventora
            </p>

            <p style="margin:5px;">
              This is an automated email. Please do not reply.
            </p>

          </div>

        </div>

      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendWelcomeEmail;
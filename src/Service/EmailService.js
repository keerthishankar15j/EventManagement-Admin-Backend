const nodemailer = require("nodemailer");


// ======================================================
// EMAIL TRANSPORTER
// ======================================================

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false,

  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },

  // Development / testing only
  tls: {
    rejectUnauthorized: false,
  },
});


// ======================================================
// SEND LOGIN SUCCESS EMAIL
// ======================================================

const sendLoginSuccessEmail = async (user) => {
  try {

    // --------------------------------------------------
    // Validate user
    // --------------------------------------------------

    if (!user || !user.email) {
      return {
        success: false,
        message: "User email is required",
      };
    }


    // --------------------------------------------------
    // Dynamic values
    // --------------------------------------------------

    const userName = user.name || "User";

    const firstLetter =
      userName.charAt(0).toUpperCase();

    const loginTime = new Date().toLocaleString(
      "en-IN",
      {
        dateStyle: "full",
        timeStyle: "short",
      }
    );


    // ==================================================
    // MAIL OPTIONS
    // ==================================================

    const mailOptions = {

      from:
        `"EventFlow" <${process.env.MAIL_USER}>`,

      // IMPORTANT:
      // Email goes to the logged-in user's email
      to: user.email,

      subject:
        "🎉 You're In! | EventFlow Login Successful",

      html: `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0"
>

<title>
  EventFlow - Login Successful
</title>

</head>


<body
  style="
    margin:0;
    padding:0;
    background:#f7f5ff;
    font-family:Arial,Helvetica,sans-serif;
  "
>


<!-- ==================================================
     MAIN BACKGROUND
     ================================================== -->

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#f7f5ff;
    margin:0;
    padding:0;
  "
>

<tr>

<td
  align="center"
  style="
    padding:24px 10px;
  "
>


<!-- ==================================================
     MAIN EMAIL CONTAINER
     ================================================== -->

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    max-width:650px;
    background:#ffffff;
    border-radius:18px;
    overflow:hidden;
    box-shadow:0 8px 30px rgba(78,42,180,0.12);
  "
>


<!-- ==================================================
     TOP BRAND HEADER
     ================================================== -->

<tr>

<td
  style="
    padding:18px 24px;
    background:#ffffff;
    border-bottom:1px solid #eee9ff;
  "
>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
>

<tr>


<!-- LOGO ICON -->

<td
  width="44"
  valign="middle"
>

<table
  width="42"
  height="42"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:42px;
    height:42px;
    background:#ffffff;
    border:3px solid #7040e8;
    border-radius:11px;
  "
>

<tr>

<td
  align="center"
  valign="middle"
  style="
    font-size:23px;
    color:#7040e8;
    font-weight:bold;
  "
>
  ✦
</td>

</tr>

</table>

</td>


<!-- BRAND NAME -->

<td
  valign="middle"
  style="
    padding-left:9px;
  "
>

<div
  style="
    font-size:20px;
    line-height:22px;
    font-weight:bold;
    color:#5531d4;
  "
>
  EventFlow
</div>


<div
  style="
    margin-top:2px;
    font-size:9px;
    line-height:12px;
    color:#77718d;
  "
>
  Your Events • Our Priority
</div>

</td>


<!-- RIGHT TEXT -->

<td
  align="right"
  valign="middle"
  style="
    font-size:10px;
    color:#706b82;
    font-weight:bold;
  "
>
  Event Management Platform
</td>


</tr>

</table>

</td>

</tr>



<!-- ==================================================
     HERO ILLUSTRATION AREA
     ================================================== -->

<tr>

<td
  align="center"
  style="
    padding:28px 20px 5px;
    background:#ffffff;
  "
>


<!-- CONFETTI -->

<div
  style="
    font-size:17px;
    line-height:22px;
    letter-spacing:10px;
    color:#7c3aed;
    margin-bottom:8px;
  "
>
  • ✦ • ✧ • ✦ •
</div>


<!-- ==================================================
     ENVELOPE ILLUSTRATION
     ================================================== -->

<table
  width="145"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:145px;
    margin:0 auto;
  "
>

<tr>

<td
  align="center"
  style="
    padding-bottom:5px;
  "
>


<!-- TOP FLAP -->

<div
  style="
    width:0;
    height:0;
    margin:0 auto -1px auto;
    border-left:72px solid transparent;
    border-right:72px solid transparent;
    border-top:45px solid #a78bfa;
  "
>
</div>


<!-- ENVELOPE -->

<table
  width="145"
  height="88"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:145px;
    height:88px;
    background:#6d45ed;
    border-radius:7px;
    box-shadow:0 8px 20px rgba(92,50,220,0.22);
  "
>

<tr>

<td
  align="center"
  valign="middle"
>


<!-- CHECK CIRCLE -->

<table
  width="39"
  height="39"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:39px;
    height:39px;
    background:#ffffff;
    border-radius:50%;
  "
>

<tr>

<td
  align="center"
  valign="middle"
  style="
    color:#6d45ed;
    font-size:23px;
    font-weight:bold;
  "
>
  ✓
</td>

</tr>

</table>


</td>

</tr>

</table>

</td>

</tr>

</table>



<!-- PAPER PLANE -->

<div
  style="
    font-size:29px;
    color:#9c27d9;
    margin-top:-15px;
    margin-left:125px;
    transform:rotate(-12deg);
  "
>
  ➤
</div>


<!-- ==================================================
     MAIN TITLE
     ================================================== -->

<div
  style="
    margin-top:2px;
    font-family:Georgia,'Times New Roman',serif;
    font-size:42px;
    line-height:48px;
    font-style:italic;
    font-weight:bold;
    color:#202050;
  "
>
  You're In! 🎉
</div>


<div
  style="
    margin-top:7px;
    font-size:15px;
    line-height:22px;
    color:#565174;
  "
>

Your EventFlow account has been

<br>

successfully signed in.

</div>


</td>

</tr>



<!-- ==================================================
     WELCOME CARD
     ================================================== -->

<tr>

<td
  style="
    padding:18px 18px 12px;
  "
>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:linear-gradient(
      135deg,
      #f0e5ff,
      #e4f5ff
    );
    border-radius:13px;
  "
>

<tr>


<!-- AVATAR -->

<td
  width="65"
  valign="middle"
  align="center"
  style="
    padding:16px 5px 16px 14px;
  "
>

<table
  width="48"
  height="48"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    width:48px;
    height:48px;
    background:#6435e8;
    border-radius:50%;
  "
>

<tr>

<td
  align="center"
  valign="middle"
  style="
    color:#ffffff;
    font-size:19px;
    font-weight:bold;
  "
>
  ${firstLetter}
</td>

</tr>

</table>

</td>


<!-- WELCOME TEXT -->

<td
  valign="middle"
  style="
    padding:15px 15px;
  "
>

<div
  style="
    font-size:14px;
    color:#5c5871;
    line-height:18px;
  "
>
  Welcome
</div>


<div
  style="
    font-size:20px;
    line-height:24px;
    color:#20204c;
    font-weight:bold;
  "
>
  ${userName}!
</div>


<div
  style="
    margin-top:2px;
    font-size:10px;
    line-height:15px;
    color:#77718b;
  "
>
  Your event journey starts here.
</div>

</td>


</tr>

</table>

</td>

</tr>



<!-- ==================================================
     EVENT JOURNEY
     ================================================== -->

<tr>

<td
  align="center"
  style="
    padding:8px 14px 20px;
  "
>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
>

<tr>


<!-- DISCOVER -->

<td
  width="22%"
  align="center"
  valign="top"
>

<div
  style="
    font-size:29px;
    line-height:40px;
  "
>
  🔍
</div>

<div
  style="
    font-size:10px;
    font-weight:bold;
    color:#29264c;
    margin-top:3px;
  "
>
  Discover
</div>

<div
  style="
    font-size:8px;
    color:#77718b;
    margin-top:3px;
  "
>
  Find exciting
  <br>
  events
</div>

</td>


<!-- ARROW -->

<td
  width="4%"
  align="center"
  valign="middle"
  style="
    font-size:19px;
    color:#6539dd;
  "
>
  →
</td>


<!-- REGISTER -->

<td
  width="22%"
  align="center"
  valign="top"
>

<div
  style="
    font-size:29px;
    line-height:40px;
  "
>
  🎟️
</div>

<div
  style="
    font-size:10px;
    font-weight:bold;
    color:#29264c;
    margin-top:3px;
  "
>
  Register
</div>

<div
  style="
    font-size:8px;
    color:#77718b;
    margin-top:3px;
  "
>
  Book your
  <br>
  spot
</div>

</td>


<!-- ARROW -->

<td
  width="4%"
  align="center"
  valign="middle"
  style="
    font-size:19px;
    color:#6539dd;
  "
>
  →
</td>


<!-- EXPERIENCE -->

<td
  width="22%"
  align="center"
  valign="top"
>

<div
  style="
    font-size:29px;
    line-height:40px;
  "
>
  📅
</div>

<div
  style="
    font-size:10px;
    font-weight:bold;
    color:#29264c;
    margin-top:3px;
  "
>
  Experience
</div>

<div
  style="
    font-size:8px;
    color:#77718b;
    margin-top:3px;
  "
>
  Be part of
  <br>
  amazing moments
</div>

</td>


<!-- ARROW -->

<td
  width="4%"
  align="center"
  valign="middle"
  style="
    font-size:19px;
    color:#6539dd;
  "
>
  →
</td>


<!-- ENJOY -->

<td
  width="22%"
  align="center"
  valign="top"
>

<div
  style="
    font-size:29px;
    line-height:40px;
  "
>
  ⭐
</div>

<div
  style="
    font-size:10px;
    font-weight:bold;
    color:#29264c;
    margin-top:3px;
  "
>
  Enjoy
</div>

<div
  style="
    font-size:8px;
    color:#77718b;
    margin-top:3px;
  "
>
  Create
  <br>
  memories
</div>

</td>


</tr>

</table>


</td>

</tr>



<!-- ==================================================
     LOGIN INFORMATION
     ================================================== -->

<tr>

<td
  style="
    padding:0 18px 18px;
  "
>


<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#faf9ff;
    border:1px solid #ebe5ff;
    border-radius:12px;
  "
>

<tr>

<td
  style="
    padding:14px 17px;
  "
>

<div
  style="
    font-size:13px;
    font-weight:bold;
    color:#40376d;
    margin-bottom:8px;
  "
>
  🔐 Login Details
</div>


<div
  style="
    font-size:11px;
    color:#77718b;
    line-height:20px;
  "
>

<strong style="color:#423b62;">
  Name:
</strong>

${userName}

&nbsp;&nbsp; | &nbsp;&nbsp;

<strong style="color:#423b62;">
  Email:
</strong>

${user.email}

<br>

<strong style="color:#423b62;">
  Login Time:
</strong>

${loginTime}

&nbsp;&nbsp; | &nbsp;&nbsp;

<strong style="color:#423b62;">
  Status:
</strong>

<span
  style="
    color:#08a66a;
    font-weight:bold;
  "
>
  ● Active
</span>

</div>

</td>

</tr>

</table>

</td>

</tr>



<!-- ==================================================
     EXPLORE EVENTS BUTTON
     ================================================== -->

<tr>

<td
  align="center"
  style="
    padding:3px 20px 28px;
  "
>

<table
  cellpadding="0"
  cellspacing="0"
  border="0"
>

<tr>

<td
  align="center"
  style="
    border-radius:28px;
    background:
      linear-gradient(
        90deg,
        #6436ec,
        #ec38c5
      );
    box-shadow:
      0 7px 18px
      rgba(117,55,226,0.25);
  "
>

<a
  href="#"
  style="
    display:inline-block;
    padding:13px 34px;
    color:#ffffff;
    font-size:13px;
    font-weight:bold;
    text-decoration:none;
    border-radius:28px;
  "
>
  Explore Events →
</a>

</td>

</tr>

</table>

</td>

</tr>



<!-- ==================================================
     EVENT CELEBRATION SECTION
     ================================================== -->

<tr>

<td
  align="center"
  style="
    padding:0;
    background:
      linear-gradient(
        180deg,
        #fbf5ff,
        #eee4ff
      );
  "
>


<!-- TOP DECORATION -->

<div
  style="
    padding-top:18px;
    font-size:24px;
    letter-spacing:7px;
  "
>
  ✦ ✧ ✦ ✧ ✦
</div>


<!-- STAGE -->

<div
  style="
    font-size:50px;
    line-height:55px;
    margin-top:2px;
  "
>
  🎪
</div>


<!-- CROWD -->

<div
  style="
    font-size:31px;
    line-height:35px;
    letter-spacing:2px;
  "
>
  🧑‍🤝‍🧑 🧑‍🤝‍🧑 🧑‍🤝‍🧑
</div>


<!-- EVENT TEXT -->

<div
  style="
    margin-top:-18px;
    margin-left:270px;
    padding-bottom:18px;
    text-align:left;
    font-family:Georgia,'Times New Roman',serif;
    font-size:15px;
    line-height:18px;
    font-style:italic;
    font-weight:bold;
    color:#4a3a91;
  "
>
  Good Events
  <br>
  Great Vibes ♡
</div>


</td>

</tr>



<!-- ==================================================
     SECURITY MESSAGE
     ================================================== -->

<tr>

<td
  style="
    padding:18px;
    background:#ffffff;
  "
>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  border="0"
  style="
    background:#fff9ef;
    border:1px solid #ffe3bb;
    border-radius:11px;
  "
>

<tr>

<td
  style="
    padding:13px 15px;
    font-size:11px;
    line-height:17px;
    color:#8a5b24;
  "
>

<strong>
  🔐 Security Notice
</strong>

<br>

Your account was successfully signed in at:

<strong>
  ${loginTime}
</strong>

<br>

If you did not perform this login,
please change your password immediately.

</td>

</tr>

</table>

</td>

</tr>



<!-- ==================================================
     FOOTER
     ================================================== -->

<tr>

<td
  align="center"
  style="
    padding:20px 20px 18px;
    background:
      linear-gradient(
        135deg,
        #f4efff,
        #faf7ff
      );
    border-top:1px solid #e9e2ff;
  "
>


<div
  style="
    font-size:18px;
    font-weight:bold;
    color:#5932d7;
  "
>
  ✦ EventFlow
</div>


<div
  style="
    margin-top:5px;
    font-size:9px;
    color:#827c96;
  "
>
  Plan &nbsp;•&nbsp;
  Register &nbsp;•&nbsp;
  Experience &nbsp;•&nbsp;
  Enjoy
</div>


<div
  style="
    width:80%;
    margin:14px auto;
    border-top:1px solid #ddd6f5;
  "
>
</div>


<div
  style="
    font-size:9px;
    line-height:14px;
    color:#8d879f;
  "
>
  This is an automated message.
  Please do not reply to this email.
</div>


<div
  style="
    margin-top:8px;
    font-size:8px;
    color:#aaa4b8;
  "
>
  © ${new Date().getFullYear()}
  EventFlow. All rights reserved.
</div>


</td>

</tr>


</table>

<!-- END MAIN EMAIL CONTAINER -->


</td>

</tr>

</table>

<!-- END BACKGROUND TABLE -->


</body>

</html>

      `,
    };


    // ==================================================
    // SEND EMAIL
    // ==================================================

    const info =
      await transporter.sendMail(mailOptions);


    console.log(
      "LOGIN SUCCESS EMAIL SENT:",
      info.messageId
    );


    return {
      success: true,

      message:
        "Login success email sent successfully",

      messageId:
        info.messageId,
    };


  } catch (error) {

    console.error(
      "LOGIN SUCCESS EMAIL ERROR:",
      error.message
    );


    return {
      success: false,
      message: error.message,
    };
  }
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  sendLoginSuccessEmail,
};
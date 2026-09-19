const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  tls: {
    rejectUnauthorized: false,
  },
});

const sendLoginSuccessEmail = async (userEmail, userName) => {

  const mailOptions = {
    from: `"Event Management System" <${process.env.EMAIL_USER}>`,

    to: userEmail,

    subject: "Successfully Logged In - Event Management",

    html: `
     
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EventHub - Login Successful</title>

  <style>
    /* =========================
       GLOBAL STYLES
    ========================= */

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Segoe UI", Arial, sans-serif;
      background: linear-gradient(
        135deg,
        #f4f7ff,
        #eef5ff,
        #f9f4ff
      );
      color: #17265c;
      min-height: 100vh;
    }

    button {
      font-family: inherit;
      cursor: pointer;
    }

    /* =========================
       MAIN CONTAINER
    ========================= */

    .event-container {
      display: flex;
      min-height: 100vh;
      padding: 30px;
      gap: 30px;
    }

    /* =========================
       LEFT ILLUSTRATION
    ========================= */

    .left-section {
      width: 280px;
      min-width: 240px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 25px 15px;
      border-radius: 28px;
      background: linear-gradient(
        180deg,
        #ffffff,
        #f1f2ff
      );
      overflow: hidden;
    }

    .logo {
      text-align: center;
    }

    .logo-icon {
      font-size: 48px;
      margin-bottom: 5px;
    }

    .logo h1 {
      font-size: 28px;
      font-weight: 800;
      color: #14265d;
    }

    .logo h1 span {
      color: #7250f4;
    }

    .logo p {
      font-size: 12px;
      color: #6372a1;
      margin-top: 5px;
    }

    /* =========================
       ILLUSTRATION
    ========================= */

    .illustration {
      width: 100%;
      text-align: center;
      position: relative;
      padding-top: 25px;
    }

    .illustration-note {
      color: #7658e9;
      font-size: 17px;
      font-weight: 600;
      font-style: italic;
      line-height: 1.6;
      margin-bottom: 35px;
    }

    .person {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .person-head {
      width: 95px;
      height: 95px;
      border-radius: 50%;
      background: #ffd5b8;
      border: 5px solid #263c91;
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
    }

    .person-body {
      width: 160px;
      height: 125px;
      border-radius: 70px 70px 20px 20px;
      background: linear-gradient(
        135deg,
        #7759ed,
        #b4a0ff
      );
      margin-top: -10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 55px;
    }

    .laptop {
      width: 180px;
      height: 105px;
      background: linear-gradient(
        135deg,
        #d6d7ff,
        #a9b1e9
      );
      border: 6px solid #ffffff;
      border-radius: 12px;
      margin-top: -20px;
      position: relative;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 35px;
      box-shadow: 0 10px 25px rgba(71, 78, 157, 0.2);
    }

    .illustration-bottom {
      width: 150%;
      height: 100px;
      border-radius: 50% 50% 0 0;
      background: linear-gradient(
        180deg,
        #e0ddff,
        #c5c6ff
      );
      margin-top: -30px;
    }

    .left-bottom-text {
      color: #7057df;
      font-size: 17px;
      font-style: italic;
      text-align: center;
      line-height: 1.5;
      font-weight: 600;
      margin-top: 20px;
    }

    /* =========================
       RIGHT MAIN SECTION
    ========================= */

    .right-section {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    /* =========================
       TOP HEADER
    ========================= */

    .top-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 15px;
      gap: 15px;
    }

    .brand-mobile {
      display: none;
    }

    .profile {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-left: auto;
    }

    .profile-avatar {
      width: 44px;
      height: 44px;
      background: #e4dcff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }

    .profile-info strong {
      display: block;
      font-size: 14px;
      color: #18265e;
    }

    .profile-info small {
      display: block;
      font-size: 12px;
      color: #7280a9;
      margin-top: 3px;
    }

    .dropdown {
      font-size: 18px;
      color: #304278;
    }

    /* =========================
       SUCCESS CARD
    ========================= */

    .success-card {
      background: #ffffff;
      border-radius: 28px;
      padding: 28px 38px;
      box-shadow: 0 10px 40px rgba(78, 89, 160, 0.07);
    }

    .success-header {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .success-icon {
      width: 68px;
      height: 68px;
      flex-shrink: 0;
      background: linear-gradient(
        135deg,
        #32d59a,
        #08b987
      );
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 38px;
      box-shadow: 0 5px 20px rgba(27, 191, 135, 0.2);
    }

    .success-text h2 {
      font-size: clamp(22px, 3vw, 30px);
      font-weight: 800;
      color: #17265c;
    }

    .success-text h2 span {
      color: #7654f4;
    }

    .success-text p {
      font-size: 14px;
      color: #6372a1;
      margin-top: 8px;
      line-height: 1.6;
    }

    .success-message {
      margin-top: 22px;
      padding: 22px;
      border-radius: 18px;
      background: linear-gradient(
        100deg,
        #f0f3ff,
        #f6f4ff
      );
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
    }

    .message-left {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .message-icon {
      width: 48px;
      height: 48px;
      background: #e6ddff;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 23px;
      flex-shrink: 0;
    }

    .message-text h3 {
      font-size: 16px;
      color: #18265e;
      margin-bottom: 7px;
    }

    .message-text p {
      font-size: 12px;
      line-height: 1.7;
      color: #7180a7;
    }

    .message-note {
      font-size: 16px;
      font-style: italic;
      color: #7859e8;
      font-weight: 600;
      white-space: nowrap;
    }

    /* =========================
       EVENTS SECTION
    ========================= */

    .events-section {
      background: #ffffff;
      border-radius: 28px;
      padding: 25px;
      box-shadow: 0 10px 40px rgba(78, 89, 160, 0.07);
    }

    .section-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 20px;
    }

    .section-heading h2 {
      font-size: 22px;
      color: #18265e;
      font-weight: 800;
    }

    .section-heading h2::before {
      content: "✦";
      color: #8d5fff;
      margin-right: 12px;
    }

    .view-all {
      color: #7555e9;
      font-size: 13px;
      font-weight: 600;
      white-space: nowrap;
    }

    /* =========================
       EVENT GRID
    ========================= */

    .events-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 14px;
    }

    .event-card {
      padding: 18px 16px;
      min-height: 145px;
      border-radius: 16px;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
    }

    .event-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(80, 90, 160, 0.12);
    }

    .event-card:nth-child(1) {
      background: linear-gradient(
        135deg,
        #f3eaff,
        #e9ddff
      );
    }

    .event-card:nth-child(2) {
      background: linear-gradient(
        135deg,
        #e7f4ff,
        #e0f0ff
      );
    }

    .event-card:nth-child(3) {
      background: linear-gradient(
        135deg,
        #e8faed,
        #dff7e5
      );
    }

    .event-card:nth-child(4) {
      background: linear-gradient(
        135deg,
        #fff0f3,
        #ffe5eb
      );
    }

    .event-card:nth-child(5) {
      background: linear-gradient(
        135deg,
        #fff6dc,
        #fff0c8
      );
    }

    .event-card:nth-child(6) {
      background: linear-gradient(
        135deg,
        #e3f9ff,
        #dcf4fa
      );
    }

    .event-card:nth-child(7) {
      background: linear-gradient(
        135deg,
        #eeeaff,
        #e7e2ff
      );
    }

    .event-card:nth-child(8) {
      background: linear-gradient(
        135deg,
        #eaf3ff,
        #e2efff
      );
    }

    .event-icon {
      font-size: 26px;
      margin-bottom: 10px;
    }

    .event-card h3 {
      font-size: 14px;
      font-weight: 800;
      color: #1d2e6a;
      margin-bottom: 8px;
    }

    .event-card p {
      font-size: 11px;
      color: #7180a7;
      line-height: 1.5;
      flex: 1;
    }

    .event-arrow {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background: #7956ef;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      font-size: 15px;
      font-weight: bold;
    }

    .event-card:nth-child(2) .event-arrow {
      background: #2589e6;
    }

    .event-card:nth-child(3) .event-arrow {
      background: #39bd67;
    }

    .event-card:nth-child(4) .event-arrow {
      background: #f44f91;
    }

    .event-card:nth-child(5) .event-arrow {
      background: #ffae00;
    }

    .event-card:nth-child(6) .event-arrow {
      background: #12b9ca;
    }

    /* =========================
       BOOK YOUR SLOT
    ========================= */

    .booking-area {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      margin-top: 24px;
    }

    .book-btn {
      border: none;
      border-radius: 50px;
      padding: 15px 30px;
      background: linear-gradient(
        100deg,
        #7950f5,
        #6845e7
      );
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      box-shadow: 0 8px 20px rgba(111, 75, 232, 0.2);
      transition: transform 0.3s ease;
    }

    .book-btn:hover {
      transform: translateY(-3px);
    }

    .book-btn:active {
      transform: scale(0.98);
    }

    .booking-note {
      color: #7659e9;
      font-size: 14px;
      font-style: italic;
      font-weight: 600;
    }

    /* =========================
       FOOTER
    ========================= */

    .footer {
      display: flex;
      justify-content: center;
      gap: 35px;
      padding: 10px 0;
      color: #7180a7;
      font-size: 12px;
      flex-wrap: wrap;
    }

    .footer span {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* =========================
       RESPONSIVE DESIGN
    ========================= */

    @media (max-width: 1100px) {
      .event-container {
        padding: 20px;
        gap: 20px;
      }

      .left-section {
        width: 230px;
        min-width: 200px;
      }

      .events-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .message-note {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .event-container {
        flex-direction: column;
        padding: 15px;
      }

      .left-section {
        width: 100%;
        min-width: 0;
        min-height: auto;
        padding: 20px;
      }

      .illustration {
        display: none;
      }

      .illustration-bottom {
        display: none;
      }

      .left-bottom-text {
        margin-top: 20px;
      }

      .top-header {
        padding: 5px;
      }

      .success-card {
        padding: 22px;
      }

      .success-header {
        align-items: flex-start;
      }

      .success-icon {
        width: 55px;
        height: 55px;
        font-size: 30px;
      }

      .success-message {
        padding: 16px;
      }

      .events-section {
        padding: 18px;
      }

      .section-heading h2 {
        font-size: 19px;
      }

      .events-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .event-card {
        min-height: 140px;
        padding: 15px;
      }

      .booking-area {
        flex-direction: column;
      }

      .footer {
        gap: 15px;
      }
    }

    @media (max-width: 420px) {
      .events-grid {
        grid-template-columns: 1fr;
      }

      .success-card {
        padding: 18px;
      }

      .success-text h2 {
        font-size: 22px;
      }

      .success-text p {
        font-size: 12px;
      }

      .message-left {
        align-items: flex-start;
      }

      .message-text h3 {
        font-size: 14px;
      }

      .section-heading {
        align-items: flex-start;
        flex-direction: column;
      }

      .booking-note {
        text-align: center;
      }
    }
  </style>
</head>

<body>

  <div class="event-container">

    <!-- =========================
         LEFT SECTION
    ========================= -->

    <aside class="left-section">

      <div class="logo">
        <div class="logo-icon">🗓️</div>
        <h1>Event<span>Hub</span></h1>
        <p>Event Management Panel</p>
      </div>

      <div class="illustration">

        <div class="illustration-note">
          Great Events<br>
          Create Lasting<br>
          Memories!
        </div>

        <div class="person">
          <div class="person-head">👩🏻</div>
          <div class="person-body">👩🏻‍💻</div>
          <div class="laptop">⭐</div>
        </div>

        <div class="illustration-bottom"></div>

      </div>

      <div class="left-bottom-text">
        More Events<br>
        More Opportunities!
      </div>

    </aside>


    <!-- =========================
         RIGHT SECTION
    ========================= -->

    <main class="right-section">

      <!-- TOP HEADER -->

      <header class="top-header">

        <div class="brand-mobile">
          EventHub
        </div>

        <div class="profile">

          <div class="profile-avatar">
            👩🏻
          </div>

          <div class="profile-info">
            <strong id="userName">Keerthi Shankar</strong>
            <small>Admin</small>
          </div>

          <div class="dropdown">
           ⌄
          </div>

        </div>

      </header>


      <!-- SUCCESS CARD -->

      <section class="success-card">

        <div class="success-header">

          <div class="success-icon">
            ✓
          </div>

          <div class="success-text">

            <h2>
              Login Successful!
            </h2>

            <p>
              Welcome back, <strong id="welcomeName">Keerthi</strong>!
            </p>

            <p>
              You have successfully logged in to the
              Event Management Panel.
            </p>

          </div>

        </div>


        <!-- WELCOME MESSAGE -->

        <div class="success-message">

          <div class="message-left">

            <div class="message-icon">
              ✉️
            </div>

            <div class="message-text">

              <h3>
                Here's what you can do now
              </h3>

              <p>
                Explore, manage and create amazing events.
                You have full access to all features from
                the EventHub panel.
              </p>

            </div>

          </div>

          <div class="message-note">
            Let's<br>
            Get Started!
          </div>

        </div>

      </section>


      <!-- EXPLORE EVENTS -->

      <section class="events-section">

        <div class="section-heading">

          <h2>
            Explore Events
          </h2>

          <div class="view-all">
            View All Events →
          </div>

        </div>


        <div class="events-grid">

          <!-- BUSINESS EVENTS -->

          <div class="event-card">

            <div class="event-icon">
              💼
            </div>

            <h3>
              Business Events
            </h3>

            <p>
              Workshops, Seminars,
              Conferences & More
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>


          <!-- STUDY TOURS -->

          <div class="event-card">

            <div class="event-icon">
              🎓
            </div>

            <h3>
              Study Tours
            </h3>

            <p>
              Explore new places,
              Gain new perspectives
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>


          <!-- SPORTS EVENTS -->

          <div class="event-card">

            <div class="event-icon">
              🏆
            </div>

            <h3>
              Sports Events
            </h3>

            <p>
              Tournaments, Competitions,
              & Fitness Events
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>


          <!-- CULTURAL EVENTS -->

          <div class="event-card">

            <div class="event-icon">
              🎨
            </div>

            <h3>
              Cultural Events
            </h3>

            <p>
              Festivals, Arts, Music
              & Talent Shows
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>


          <!-- YOUTH AFFAIRS -->

          <div class="event-card">

            <div class="event-icon">
              👥
            </div>

            <h3>
              Youth Affairs
            </h3>

            <p>
              Leadership Programs,
              Social Activities & More
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>


          <!-- TECHNICAL EVENTS -->

          <div class="event-card">

            <div class="event-icon">
              💻
            </div>

            <h3>
              Technical Events
            </h3>

            <p>
              Hackathons, Tech Talks,
              Coding Competitions
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>


          <!-- WORKSHOPS -->

          <div class="event-card">

            <div class="event-icon">
              ⚙️
            </div>

            <h3>
              Workshops & Training
            </h3>

            <p>
              Skill Development,
              Hands-on Learning
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>


          <!-- MORE EVENTS -->

          <div class="event-card">

            <div class="event-icon">
              ▦
            </div>

            <h3>
              And Many More...
            </h3>

            <p>
              Explore More Events
              and Opportunities
            </p>

            <div class="event-arrow">
              →
            </div>

          </div>

        </div>


        <!-- BOOK YOUR SLOT -->

        <div class="booking-area">

          <button
            class="book-btn"
            onclick="bookSlot()"
          >
            📅 Book Your Slot →
          </button>

          <div class="booking-note">
            More Events,<br>
            More Opportunities!
          </div>

        </div>

      </section>


      <!-- FOOTER -->

      <footer class="footer">

        <span>
          🛡️ Build Connections
        </span>

        <span>
          📖 Gain Knowledge
        </span>

        <span>
          💡 Create Impact
        </span>

      </footer>

    </main>

  </div>


  <!-- =========================
       JAVASCRIPT
  ========================= -->

  <script>

    function bookSlot() {
      alert(
        "Explore our events and book your slot!"
      );
    }

  </script>

</body>
</html>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendLoginSuccessEmail,
};
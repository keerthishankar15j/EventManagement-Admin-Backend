const express =
  require("express");

const mongoose =
  require("mongoose");

const cors =
  require("cors");

require("dotenv").config();


const app =
  express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://event-admin-one.vercel.app"
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS"
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization"
    ]
  })
);


app.use(
  express.json()
);


// =====================================================
// ROUTES
// =====================================================

app.use(
  "/user-contact",
  require("./Routes/UserContactRouter")
);


app.use(
  "/organization",
  require("./Routes/OrganizationRouter")
);


// =====================================================
// TEST
// =====================================================

app.get(
  "/",
  (req, res) => {

    res.send(
      "Eventora Admin API is working!"
    );

  }
);


// =====================================================
// DATABASE
// =====================================================

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {

    console.log(
      "MongoDB connected"
    );


    const {
      verifyEmailConnection
    } =
      require("./Services/EmailService");


    await verifyEmailConnection();

  })
  .catch((error) => {

    console.log(
      "MongoDB Error:",
      error.message
    );

  });


// =====================================================
// SERVER
// =====================================================

const PORT =
  process.env.PORT || 5000;


app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );

  }
);
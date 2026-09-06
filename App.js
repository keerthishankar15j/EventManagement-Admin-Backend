
const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

const eventRoutes = require("./src/Router/EventRouter");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// STATIC UPLOADS
// =====================================================

const uploadFolder = path.join(__dirname, "uploads");

console.log("SERVING UPLOADS FROM:", uploadFolder);

app.use(
  "/uploads",
  express.static(uploadFolder)
);

// =====================================================
// ROOT
// =====================================================

app.get("/", (req, res) => {
  res.json({
    message: "Admin API is working!"
  });
});

// =====================================================
// ROUTES
// =====================================================

app.use("/events", eventRoutes);

// =====================================================
// MONGODB
// =====================================================

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// =====================================================
// EXPORT APP FOR VERCEL
// =====================================================

module.exports = app;






























// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const path = require("path");

// const eventRoutes = require("./src/Router/EventRouter");

// const app = express();

// // =====================================================
// // MIDDLEWARE
// // =====================================================

// app.use(
//   cors({
//     // origin: "http://localhost:517",
//     // origin: "https://event-admin-one.vercel.app/",
//     origin: "*",
//   })
// );

// app.use(express.json());

// app.use(
//   express.urlencoded({
//     extended: true,
//   })
// );

// // =====================================================
// // STATIC UPLOADS
// // =====================================================

// const uploadFolder = path.join(
//   __dirname,
//   "uploads"
// );

// console.log(
//   "SERVING UPLOADS FROM:",
//   uploadFolder
// );

// app.use(
//   "/uploads",
//   express.static(uploadFolder)
// );

// app.get("/", (req, res) => {
//     res.json({
//         message: "Admin API is working!"
//     });
// });
// // =====================================================
// // ROUTES
// // =====================================================

// app.use(
//   "/events",
//   eventRoutes
// );


// // =====================================================
// // MONGODB
// // =====================================================

// mongoose
//   .connect(
//     "mongodb+srv://keerthiga:keerthi15j@cluster0.06b7vqp.mongodb.net/?appName=Cluster0"
//   )
//   .then(() => {

//     console.log(
//       "MongoDB connected"
//     );

//     app.listen(9000, () => {

//       console.log(
//         "Server running on port 9000"
//       );

//     });

//   })
//   .catch((error) => {

//     console.log(
//       "MongoDB connection error:",
//       error
//     );

//   });
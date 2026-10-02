const express = require("express");
const cors = require("cors");

const app = express();

// =====================================================
// CORS
// =====================================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://event-admin-one.vercel.app",
      "https://event-user-one.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =====================================================
// ROUTES
// =====================================================

const eventRouter = require("./Routes/EventRouter");

app.use("/events", eventRouter);

// Other routes if you have them
// app.use("/users", userRouter);
// app.use("/contact", contactRouter);

// =====================================================
// TEST
// =====================================================

app.get("/", (req, res) => {
  res.send("Admin API is working!");
});

// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// =====================================================
// BOOKING ROUTES
// =====================================================

app.use(
  "/bookings",
  async (req, res, next) => {
    try {
      await connectDB();

      console.log(
        `BOOKING REQUEST: ${req.method} ${req.originalUrl}`
      );

      next();

    } catch (error) {
      console.error(
        "BOOKING DATABASE ERROR:",
        error.message
      );

      return res.status(500).json({
        success: false,
        message: "Booking database connection failed",
        error: error.message,
      });
    }
  }
);

app.use(
  "/bookings",
  bookingRoutes
);
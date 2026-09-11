const express = require("express");
const multer = require("multer");

const eventModel = require("../Model/EventModel");

const router = express.Router();

// =====================================================
// MULTER CONFIGURATION
// =====================================================

// Store image temporarily in memory
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// =====================================================
// CREATE EVENT
// =====================================================

router.post("/create", upload.single("image"), async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE EVENT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file ? req.file.originalname : "NO FILE");
    console.log("=================================");

    const {
      name,
      organizer,
      date,
      time,
      location,
      description,
      category,
      tickets,
      ticketPrice,
    } = req.body;

    // =================================================
    // VALIDATION
    // =================================================

    if (
      !name ||
      !organizer ||
      !date ||
      !time ||
      !location ||
      !description ||
      !category ||
      !tickets ||
      ticketPrice === undefined ||
      ticketPrice === null ||
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "All event fields are required",
      });
    }

    // =================================================
    // CONVERT IMAGE TO BASE64
    // =================================================

    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    // =================================================
    // CREATE EVENT
    // =================================================

    const newEvent = new eventModel({
      name: name.trim(),
      organizer: organizer.trim(),
      date,
      time,
      location: location.trim(),
      description: description.trim(),
      category,
      tickets: Number(tickets),
      ticketPrice: Number(ticketPrice),
      image: imageBase64,
    });

    // =================================================
    // SAVE TO MONGODB
    // =================================================

    const savedEvent = await newEvent.save();

    console.log("EVENT SAVED:", savedEvent._id);

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: savedEvent,
    });
  } catch (error) {
    console.log("CREATE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create event",
    });
  }
});

// =====================================================
// GET ALL EVENTS
// =====================================================

router.get("/getevents", async (req, res) => {
  try {
    const events = await eventModel
      .find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    console.log("GET EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get events",
    });
  }
});

// =====================================================
// GET SINGLE EVENT
// =====================================================

router.get("/get/:id", async (req, res) => {
  try {
    const event = await eventModel.findById(
      req.params.id
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    console.log("GET SINGLE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get event",
    });
  }
});

// =====================================================
// UPDATE EVENT
// =====================================================

router.put(
  "/update/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("=================================");
      console.log("UPDATE EVENT");
      console.log("ID:", req.params.id);
      console.log("BODY:", req.body);
      console.log("FILE:", req.file ? req.file.originalname : "NO FILE");
      console.log("=================================");

      const {
        name,
        organizer,
        date,
        time,
        location,
        description,
        category,
        tickets,
        ticketPrice,
      } = req.body;

      // =================================================
      // CHECK EVENT
      // =================================================

      const existingEvent = await eventModel.findById(
        req.params.id
      );

      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      // =================================================
      // UPDATE DATA
      // =================================================

      existingEvent.name = name;
      existingEvent.organizer = organizer;
      existingEvent.date = date;
      existingEvent.time = time;
      existingEvent.location = location;
      existingEvent.description = description;
      existingEvent.category = category;
      existingEvent.tickets = Number(tickets);
      existingEvent.ticketPrice = Number(ticketPrice);

      // =================================================
      // UPDATE IMAGE ONLY IF NEW IMAGE IS SELECTED
      // =================================================

      if (req.file) {
        existingEvent.image = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;
      }

      // =================================================
      // SAVE
      // =================================================

      const updatedEvent =
        await existingEvent.save();

      console.log(
        "EVENT UPDATED:",
        updatedEvent._id
      );

      return res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error) {
      console.log("UPDATE EVENT ERROR:", error);

      return res.status(500).json({
        success: false,
        message:
          error.message || "Failed to update event",
      });
    }
  }
);

// =====================================================
// DELETE EVENT
// =====================================================

router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedEvent =
      await eventModel.findByIdAndDelete(
        req.params.id
      );

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    console.log(
      "EVENT DELETED:",
      deletedEvent._id
    );

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.log("DELETE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
    });
  }
});

module.exports = router;
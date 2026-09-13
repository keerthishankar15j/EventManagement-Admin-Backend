const eventModel = require("../Model/EventModel");

// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE EVENT");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
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
      tickets === undefined ||
      ticketPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All event fields are required",
      });
    }

    // =================================================
    // IMAGE VALIDATION
    // =================================================

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Event image is required",
      });
    }

    // =================================================
    // CONVERT IMAGE TO BASE64
    // =================================================

    const imageBase64 =
      `data:${req.file.mimetype};base64,` +
      req.file.buffer.toString("base64");

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
    // SAVE
    // =================================================

    const savedEvent = await newEvent.save();

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: savedEvent,
    });

  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

// =====================================================
// GET ALL EVENTS
// =====================================================

const getEvents = async (req, res) => {
  try {
    console.log("GET EVENTS REQUEST");

    const events = await eventModel
      .find()
      .sort({ createdAt: -1 });

    console.log(
      "EVENTS FOUND:",
      events.length
    );

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });

  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get events",
      error: error.message,
    });
  }
};

// =====================================================
// GET SINGLE EVENT
// =====================================================

const getSingleEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await eventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event fetched successfully",
      data: event,
    });

  } catch (error) {
    console.error("GET SINGLE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get event",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE EVENT
// =====================================================

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

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
    // FIND EVENT
    // =================================================

    const event = await eventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // =================================================
    // UPDATE TEXT FIELDS
    // =================================================

    if (name !== undefined) {
      event.name = name.trim();
    }

    if (organizer !== undefined) {
      event.organizer = organizer.trim();
    }

    if (date !== undefined) {
      event.date = date;
    }

    if (time !== undefined) {
      event.time = time;
    }

    if (location !== undefined) {
      event.location = location.trim();
    }

    if (description !== undefined) {
      event.description = description.trim();
    }

    if (category !== undefined) {
      event.category = category;
    }

    if (tickets !== undefined) {
      event.tickets = Number(tickets);
    }

    if (ticketPrice !== undefined) {
      event.ticketPrice = Number(ticketPrice);
    }

    // =================================================
    // UPDATE IMAGE IF NEW IMAGE EXISTS
    // =================================================

    if (req.file) {
      const imageBase64 =
        `data:${req.file.mimetype};base64,` +
        req.file.buffer.toString("base64");

      event.image = imageBase64;
    }

    // =================================================
    // SAVE
    // =================================================

    const updatedEvent = await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });

  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE EVENT
// =====================================================

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent =
      await eventModel.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      data: deletedEvent,
    });

  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
};
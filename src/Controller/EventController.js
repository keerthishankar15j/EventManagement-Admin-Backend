const eventModel = require("../Model/EventModel");

// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (req, res) => {
  try {
    console.log("=================================");
    console.log("CREATE EVENT");
    console.log("BODY:", req.body);
    console.log(
      "FILE:",
      req.file ? req.file.originalname : "NO FILE"
    );
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
      ticketPrice === undefined ||
      !req.file
    ) {
      return res.status(400).json({
        success: false,
        message: "All event fields are required",
      });
    }

    // =================================================
    // NUMBER VALIDATION
    // =================================================

    const ticketNumber = Number(tickets);
    const priceNumber = Number(ticketPrice);

    if (
      Number.isNaN(ticketNumber) ||
      ticketNumber < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Tickets must be at least 1",
      });
    }

    if (
      Number.isNaN(priceNumber) ||
      priceNumber < 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Ticket price must be 0 or greater",
      });
    }

    // =================================================
    // IMAGE → BASE64
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
      tickets: ticketNumber,
      ticketPrice: priceNumber,
      image: imageBase64,
    });

    // =================================================
    // SAVE
    // =================================================

    const savedEvent = await newEvent.save();

    console.log(
      "EVENT SAVED:",
      savedEvent._id.toString()
    );

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: savedEvent,
    });
  } catch (error) {
    console.error(
      "CREATE EVENT ERROR:",
      error
    );

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
      .find({})
      .sort({ createdAt: -1 })
      .lean();

    console.log(
      "EVENT COUNT:",
      events.length
    );

    return res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error(
      "GET EVENTS ERROR:",
      error
    );

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

    console.log(
      "GET SINGLE EVENT:",
      id
    );

    const event =
      await eventModel.findById(id).lean();

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
    console.error(
      "GET SINGLE EVENT ERROR:",
      error
    );

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

    console.log("=================================");
    console.log("UPDATE EVENT");
    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log(
      "FILE:",
      req.file ? req.file.originalname : "NO FILE"
    );
    console.log("=================================");

    const existingEvent =
      await eventModel.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // =================================================
    // UPDATE TEXT FIELDS ONLY IF PROVIDED
    // =================================================

    if (req.body.name !== undefined) {
      existingEvent.name =
        req.body.name.trim();
    }

    if (req.body.organizer !== undefined) {
      existingEvent.organizer =
        req.body.organizer.trim();
    }

    if (req.body.date !== undefined) {
      existingEvent.date =
        req.body.date;
    }

    if (req.body.time !== undefined) {
      existingEvent.time =
        req.body.time;
    }

    if (req.body.location !== undefined) {
      existingEvent.location =
        req.body.location.trim();
    }

    if (req.body.description !== undefined) {
      existingEvent.description =
        req.body.description.trim();
    }

    if (req.body.category !== undefined) {
      existingEvent.category =
        req.body.category;
    }

    if (req.body.tickets !== undefined) {
      const ticketNumber =
        Number(req.body.tickets);

      if (
        Number.isNaN(ticketNumber) ||
        ticketNumber < 1
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Tickets must be at least 1",
        });
      }

      existingEvent.tickets =
        ticketNumber;
    }

    if (req.body.ticketPrice !== undefined) {
      const priceNumber =
        Number(req.body.ticketPrice);

      if (
        Number.isNaN(priceNumber) ||
        priceNumber < 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Ticket price must be 0 or greater",
        });
      }

      existingEvent.ticketPrice =
        priceNumber;
    }

    // =================================================
    // UPDATE IMAGE ONLY IF NEW IMAGE EXISTS
    // =================================================

    if (req.file) {
      existingEvent.image =
        `data:${req.file.mimetype};base64,` +
        req.file.buffer.toString("base64");
    }

    // =================================================
    // SAVE
    // =================================================

    const updatedEvent =
      await existingEvent.save();

    console.log(
      "EVENT UPDATED:",
      updatedEvent._id.toString()
    );

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: updatedEvent,
    });
  } catch (error) {
    console.error(
      "UPDATE EVENT ERROR:",
      error
    );

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

    console.log(
      "DELETE EVENT:",
      id
    );

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
    console.error(
      "DELETE EVENT ERROR:",
      error
    );

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
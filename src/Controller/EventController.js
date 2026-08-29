const eventModel = require("../Model/EventModel");

// =====================================================
// CREATE EVENT
// =====================================================

const createEvent = async (req, res) => {
  try {
    console.log("CREATE BODY:", req.body);
    console.log("CREATE FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({
        message: "Event image is required",
      });
    }

    const newEvent = new eventModel({
      name: req.body.name,
      organizer: req.body.organizer,
      date: req.body.date,
      time: req.body.time,
      location: req.body.location,
      description: req.body.description,
      tickets: Number(req.body.tickets),
      status: req.body.status,

      // Save only relative path
      image: `uploads/${req.file.filename}`,
    });

    const savedEvent = await newEvent.save();

    console.log("SAVED EVENT:", savedEvent);

    res.status(201).json({
      message: "Event created successfully",
      data: savedEvent,
    });

  } catch (error) {

    console.log("CREATE EVENT ERROR:", error);

    res.status(500).json({
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

    const events = await eventModel
      .find()
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message: "Events fetched successfully",
      data: events,
    });

  } catch (error) {

    console.log("GET EVENTS ERROR:", error);

    res.status(500).json({
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

    const event =
      await eventModel.findById(id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.status(200).json({
      message: "Event fetched successfully",
      data: event,
    });

  } catch (error) {

    console.log(
      "GET SINGLE EVENT ERROR:",
      error
    );

    res.status(500).json({
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

    console.log("UPDATE ID:", id);
    console.log("UPDATE BODY:", req.body);
    console.log("UPDATE FILE:", req.file);

    const existingEvent =
      await eventModel.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    // =================================================
    // UPDATE TEXT FIELDS
    // =================================================

    existingEvent.name =
      req.body.name;

    existingEvent.organizer =
      req.body.organizer;

    existingEvent.date =
      req.body.date;

    existingEvent.time =
      req.body.time;

    existingEvent.location =
      req.body.location;

    existingEvent.description =
      req.body.description;

    existingEvent.tickets =
      Number(req.body.tickets);

    existingEvent.status =
      req.body.status;


    // =================================================
    // UPDATE IMAGE ONLY IF NEW IMAGE EXISTS
    // =================================================

    if (req.file) {

      existingEvent.image =
        `uploads/${req.file.filename}`;

    }


    // =================================================
    // SAVE
    // =================================================

    const updatedEvent =
      await existingEvent.save();

    console.log(
      "UPDATED EVENT:",
      updatedEvent
    );

    res.status(200).json({
      message:
        "Event updated successfully",

      data: updatedEvent,
    });

  } catch (error) {

    console.log(
      "UPDATE EVENT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to update event",

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
        message: "Event not found",
      });

    }

    res.status(200).json({
      message:
        "Event deleted successfully",

      data: deletedEvent,
    });

  } catch (error) {

    console.log(
      "DELETE EVENT ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Failed to delete event",

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
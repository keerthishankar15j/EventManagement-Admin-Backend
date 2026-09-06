// const eventModel = require("../Model/EventModel");

// // =====================================================
// // CREATE EVENT
// // =====================================================

// const createEvent = async (req, res) => {
//   try {
//     console.log("CREATE BODY:", req.body);
//     console.log("CREATE FILE:", req.file);

//     if (!req.file) {
//       return res.status(400).json({
//         message: "Event image is required",
//       });
//     }

//     const newEvent = new eventModel({
//       name: req.body.name,
//       organizer: req.body.organizer,
//       date: req.body.date,
//       time: req.body.time,
//       location: req.body.location,
//       description: req.body.description,
//       tickets: Number(req.body.tickets),
//       status: req.body.status,

//       // // Save only relative path
//       // image: `uploads/${req.file.filename}`,
//     });

//     const savedEvent = await newEvent.save();

//     console.log("SAVED EVENT:", savedEvent);

//     res.status(201).json({
//       message: "Event created successfully",
//       data: savedEvent,
//     });

//   } catch (error) {

//     console.log("CREATE EVENT ERROR:", error);

//     res.status(500).json({
//       message: "Failed to create event",
//       error: error.message,
//     });

//   }
// };


// // =====================================================
// // GET ALL EVENTS
// // =====================================================

// const getEvents = async (req, res) => {
//   try {

//     const events = await eventModel
//       .find()
//       .sort({
//         createdAt: -1,
//       });

//     res.status(200).json({
//       message: "Events fetched successfully",
//       data: events,
//     });

//   } catch (error) {

//     console.log("GET EVENTS ERROR:", error);

//     res.status(500).json({
//       message: "Failed to get events",
//       error: error.message,
//     });

//   }
// };


// // =====================================================
// // GET SINGLE EVENT
// // =====================================================

// const getSingleEvent = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const event =
//       await eventModel.findById(id);

//     if (!event) {
//       return res.status(404).json({
//         message: "Event not found",
//       });
//     }

//     res.status(200).json({
//       message: "Event fetched successfully",
//       data: event,
//     });

//   } catch (error) {

//     console.log(
//       "GET SINGLE EVENT ERROR:",
//       error
//     );

//     res.status(500).json({
//       message: "Failed to get event",
//       error: error.message,
//     });

//   }
// };


// // =====================================================
// // UPDATE EVENT
// // =====================================================

// const updateEvent = async (req, res) => {
//   try {

//     const { id } = req.params;

//     console.log("UPDATE ID:", id);
//     console.log("UPDATE BODY:", req.body);
//     console.log("UPDATE FILE:", req.file);

//     const existingEvent =
//       await eventModel.findById(id);

//     if (!existingEvent) {
//       return res.status(404).json({
//         message: "Event not found",
//       });
//     }

//     // =================================================
//     // UPDATE TEXT FIELDS
//     // =================================================

//     existingEvent.name =
//       req.body.name;

//     existingEvent.organizer =
//       req.body.organizer;

//     existingEvent.date =
//       req.body.date;

//     existingEvent.time =
//       req.body.time;

//     existingEvent.location =
//       req.body.location;

//     existingEvent.description =
//       req.body.description;

//     existingEvent.tickets =
//       Number(req.body.tickets);

//     existingEvent.status =
//       req.body.status;


//     // =================================================
//     // UPDATE IMAGE ONLY IF NEW IMAGE EXISTS
//     // =================================================

//     // if (req.file) {

//     //   existingEvent.image =
//     //     `uploads/${req.file.filename}`;

//     // }


//     // =================================================
//     // SAVE
//     // =================================================

//     const updatedEvent =
//       await existingEvent.save();

//     console.log(
//       "UPDATED EVENT:",
//       updatedEvent
//     );

//     res.status(200).json({
//       message:
//         "Event updated successfully",

//       data: updatedEvent,
//     });

//   } catch (error) {

//     console.log(
//       "UPDATE EVENT ERROR:",
//       error
//     );

//     res.status(500).json({
//       message:
//         "Failed to update event",

//       error: error.message,
//     });

//   }
// };


// // =====================================================
// // DELETE EVENT
// // =====================================================

// const deleteEvent = async (req, res) => {
//   try {

//     const { id } = req.params;

//     const deletedEvent =
//       await eventModel.findByIdAndDelete(id);

//     if (!deletedEvent) {

//       return res.status(404).json({
//         message: "Event not found",
//       });

//     }

//     res.status(200).json({
//       message:
//         "Event deleted successfully",

//       data: deletedEvent,
//     });

//   } catch (error) {

//     console.log(
//       "DELETE EVENT ERROR:",
//       error
//     );

//     res.status(500).json({
//       message:
//         "Failed to delete event",

//       error: error.message,
//     });

//   }
// };


// // =====================================================
// // EXPORT
// // =====================================================

// module.exports = {
//   createEvent,
//   getEvents,
//   getSingleEvent,
//   updateEvent,
//   deleteEvent,
// };
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

    // Check image
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Event image is required",
      });
    }

    // Check required fields
    const {
      name,
      organizer,
      date,
      time,
      location,
      description,
      tickets,
      status,
    } = req.body;

    if (
      !name ||
      !organizer ||
      !date ||
      !time ||
      !location ||
      !description ||
      tickets === undefined ||
      !status
    ) {
      return res.status(400).json({
        success: false,
        message: "All event fields are required",
      });
    }

    // Create event
    const newEvent = new eventModel({
      name: name,
      organizer: organizer,
      date: date,
      time: time,
      location: location,
      description: description,
      tickets: Number(tickets),
      status: status,

      // Save uploaded image path
      image: `uploads/${req.file.filename}`,
    });

    // Save to MongoDB
    const savedEvent = await newEvent.save();

    console.log("EVENT SAVED:", savedEvent);

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
    const events = await eventModel
      .find()
      .sort({
        createdAt: -1,
      });

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

    console.log("=================================");
    console.log("UPDATE EVENT");
    console.log("ID:", id);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("=================================");

    const existingEvent = await eventModel.findById(id);

    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Update text fields only when provided
    if (req.body.name !== undefined) {
      existingEvent.name = req.body.name;
    }

    if (req.body.organizer !== undefined) {
      existingEvent.organizer = req.body.organizer;
    }

    if (req.body.date !== undefined) {
      existingEvent.date = req.body.date;
    }

    if (req.body.time !== undefined) {
      existingEvent.time = req.body.time;
    }

    if (req.body.location !== undefined) {
      existingEvent.location = req.body.location;
    }

    if (req.body.description !== undefined) {
      existingEvent.description = req.body.description;
    }

    if (req.body.tickets !== undefined) {
      existingEvent.tickets = Number(req.body.tickets);
    }

    if (req.body.status !== undefined) {
      existingEvent.status = req.body.status;
    }

    // Update image only if a new image is uploaded
    if (req.file) {
      existingEvent.image = `uploads/${req.file.filename}`;
    }

    // Save updated event
    const updatedEvent = await existingEvent.save();

    console.log("UPDATED EVENT:", updatedEvent);

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
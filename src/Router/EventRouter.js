
const express = require("express");
const multer = require("multer");

const eventModel = require("../Model/EventModel");

const router = express.Router();


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({

  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {

      cb(null, true);

    } else {

      cb(new Error("Only image files are allowed"));

    }

  }

});


// =====================================================
// CREATE EVENT
// =====================================================

router.post(
  "/create",
  upload.single("image"),

  async (req, res) => {

    try {

      const {
        name,
        organizer,
        date,
        time,
        location,
        description,
        category,
        tickets,
        ticketPrice
      } = req.body;


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
          message: "All event fields are required"
        });

      }


      // Convert image to Base64
      const imageBase64 =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`;


      const newEvent =
        new eventModel({

          name: name.trim(),

          organizer: organizer.trim(),

          date,

          time,

          location: location.trim(),

          description: description.trim(),

          category,

          tickets: Number(tickets),

          ticketPrice: Number(ticketPrice),

          image: imageBase64

        });


      const savedEvent =
        await newEvent.save();


      return res.status(201).json({

        success: true,

        message: "Event created successfully",

        data: savedEvent

      });

    } catch (error) {

      console.log(
        "CREATE EVENT ERROR:",
        error
      );

      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to create event"

      });

    }

  }
);


// =====================================================
// GET ALL EVENTS
// =====================================================
//
// Image is NOT sent directly.
// Instead imageUrl is generated.
// =====================================================

router.get(
  "/getevents",

  async (req, res) => {

    try {

      const events =
        await eventModel
          .find()
          .select("-image -__v")
          .sort({
            createdAt: -1
          });


      const baseUrl =
        `${req.protocol}://${req.get("host")}`;


      const formattedEvents =
        events.map((event) => ({

          ...event.toObject(),

          imageUrl:
            `${baseUrl}/events/image/${event._id}`

        }));


      return res.status(200).json({

        success: true,

        count: formattedEvents.length,

        data: formattedEvents

      });

    } catch (error) {

      console.log(
        "GET EVENTS ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to get events",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// GET EVENT IMAGE
// =====================================================

router.get(
  "/image/:id",

  async (req, res) => {

    try {

      const event =
        await eventModel
          .findById(req.params.id)
          .select("image");


      if (!event) {

        return res.status(404).json({

          success: false,

          message: "Event not found"

        });

      }


      if (!event.image) {

        return res.status(404).json({

          success: false,

          message: "Image not found"

        });

      }


      // -----------------------------------------------
      // Extract Base64 image
      // -----------------------------------------------

      const matches =
        event.image.match(
          /^data:(.+);base64,(.+)$/
        );


      if (!matches) {

        return res.status(500).json({

          success: false,

          message: "Invalid image format"

        });

      }


      const mimeType =
        matches[1];

      const base64Data =
        matches[2];


      const imageBuffer =
        Buffer.from(
          base64Data,
          "base64"
        );


      res.set(
        "Content-Type",
        mimeType
      );


      res.set(
        "Cache-Control",
        "public, max-age=86400"
      );


      return res.send(
        imageBuffer
      );

    } catch (error) {

      console.log(
        "GET IMAGE ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to get image",

        error:
          error.message

      });

    }

  }
);


// =====================================================
// GET SINGLE EVENT
// =====================================================

router.get(
  "/get/:id",

  async (req, res) => {

    try {

      const event =
        await eventModel.findById(
          req.params.id
        );


      if (!event) {

        return res.status(404).json({

          success: false,

          message: "Event not found"

        });

      }


      return res.status(200).json({

        success: true,

        data: event

      });

    } catch (error) {

      console.log(
        "GET SINGLE EVENT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message: "Failed to get event",

        error: error.message

      });

    }

  }
);


// =====================================================
// UPDATE EVENT
// =====================================================

router.put(
  "/update/:id",
  upload.single("image"),

  async (req, res) => {

    try {

      const {
        name,
        organizer,
        date,
        time,
        location,
        description,
        category,
        tickets,
        ticketPrice
      } = req.body;


      const existingEvent =
        await eventModel.findById(
          req.params.id
        );


      if (!existingEvent) {

        return res.status(404).json({

          success: false,

          message: "Event not found"

        });

      }


      if (name !== undefined)
        existingEvent.name = name.trim();


      if (organizer !== undefined)
        existingEvent.organizer = organizer.trim();


      if (date !== undefined)
        existingEvent.date = date;


      if (time !== undefined)
        existingEvent.time = time;


      if (location !== undefined)
        existingEvent.location = location.trim();


      if (description !== undefined)
        existingEvent.description =
          description.trim();


      if (category !== undefined)
        existingEvent.category = category;


      if (tickets !== undefined)
        existingEvent.tickets = Number(tickets);


      if (ticketPrice !== undefined)
        existingEvent.ticketPrice =
          Number(ticketPrice);


      // Update image only when new image is provided

      if (req.file) {

        existingEvent.image =
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`;

      }


      const updatedEvent =
        await existingEvent.save();


      return res.status(200).json({

        success: true,

        message:
          "Event updated successfully",

        data: updatedEvent

      });

    } catch (error) {

      console.log(
        "UPDATE EVENT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          error.message ||
          "Failed to update event"

      });

    }

  }
);


// =====================================================
// DELETE EVENT
// =====================================================

router.delete(
  "/delete/:id",

  async (req, res) => {

    try {

      const deletedEvent =
        await eventModel.findByIdAndDelete(
          req.params.id
        );


      if (!deletedEvent) {

        return res.status(404).json({

          success: false,

          message: "Event not found"

        });

      }


      return res.status(200).json({

        success: true,

        message:
          "Event deleted successfully"

      });

    } catch (error) {

      console.log(
        "DELETE EVENT ERROR:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete event",

        error: error.message

      });

    }

  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;


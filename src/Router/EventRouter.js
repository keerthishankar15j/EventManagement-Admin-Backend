
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
        ticketPrice
      } = req.body;


      // -------------------------------------------------
      // VALIDATION
      // -------------------------------------------------

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


      // -------------------------------------------------
      // IMAGE BASE64
      // -------------------------------------------------

      const imageBase64 =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`;


      // -------------------------------------------------
      // CREATE EVENT
      // -------------------------------------------------

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

        image: imageBase64

      });


      const savedEvent =
        await newEvent.save();


      console.log(
        "EVENT SAVED:",
        savedEvent._id
      );


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
// This API does NOT send the Base64 image.
// It sends an imageUrl instead.
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


      // IMPORTANT:
      // Get API base URL from request

      const baseUrl =
        `${req.protocol}://${req.get("host")}`;


      const formattedEvents =
        events.map((event) => {

          return {

            ...event.toObject(),

            imageUrl:
              `${baseUrl}/events/image/${event._id}`

          };

        });


      console.log(
        "EVENT COUNT:",
        formattedEvents.length
      );


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

        message: "Failed to get events",

        error: error.message

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

      console.log(
        "IMAGE REQUEST:",
        req.params.id
      );


      const event =
        await eventModel
          .findById(req.params.id)
          .select("image");


      // -------------------------------------------------
      // EVENT NOT FOUND
      // -------------------------------------------------

      if (!event) {

        return res.status(404).json({

          success: false,

          message: "Event not found"

        });

      }


      // -------------------------------------------------
      // IMAGE NOT FOUND
      // -------------------------------------------------

      if (!event.image) {

        return res.status(404).json({

          success: false,

          message: "Image not found"

        });

      }


      console.log(
        "IMAGE FOUND FOR:",
        req.params.id
      );


      // -------------------------------------------------
      // CHECK BASE64 FORMAT
      // -------------------------------------------------

      const matches =
        event.image.match(
          /^data:(.+);base64,(.+)$/
        );


      if (!matches) {

        return res.status(500).json({

          success: false,

          message:
            "Image is not stored in valid Base64 format"

        });

      }


      // -------------------------------------------------
      // GET MIME TYPE
      // -------------------------------------------------

      const mimeType =
        matches[1];


      // -------------------------------------------------
      // GET BASE64 DATA
      // -------------------------------------------------

      const base64Data =
        matches[2];


      // -------------------------------------------------
      // CONVERT BASE64 TO BUFFER
      // -------------------------------------------------

      const imageBuffer =
        Buffer.from(
          base64Data,
          "base64"
        );


      // -------------------------------------------------
      // RESPONSE HEADERS
      // -------------------------------------------------

      res.setHeader(
        "Content-Type",
        mimeType
      );


      res.setHeader(
        "Content-Length",
        imageBuffer.length
      );


      res.setHeader(
        "Cache-Control",
        "public, max-age=86400"
      );


      // -------------------------------------------------
      // SEND IMAGE
      // -------------------------------------------------

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

        message:
          "Failed to get event",

        error:
          error.message

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

      console.log("=================================");
      console.log("UPDATE EVENT");
      console.log(
        "ID:",
        req.params.id
      );
      console.log(
        "BODY:",
        req.body
      );
      console.log(
        "FILE:",
        req.file
          ? req.file.originalname
          : "NO FILE"
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
        ticketPrice
      } = req.body;


      // -------------------------------------------------
      // FIND EVENT
      // -------------------------------------------------

      const existingEvent =
        await eventModel.findById(
          req.params.id
        );


      if (!existingEvent) {

        return res.status(404).json({

          success: false,

          message:
            "Event not found"

        });

      }


      // -------------------------------------------------
      // UPDATE FIELDS
      // -------------------------------------------------

      if (name !== undefined) {
        existingEvent.name =
          name.trim();
      }


      if (organizer !== undefined) {
        existingEvent.organizer =
          organizer.trim();
      }


      if (date !== undefined) {
        existingEvent.date =
          date;
      }


      if (time !== undefined) {
        existingEvent.time =
          time;
      }


      if (location !== undefined) {
        existingEvent.location =
          location.trim();
      }


      if (description !== undefined) {
        existingEvent.description =
          description.trim();
      }


      if (category !== undefined) {
        existingEvent.category =
          category;
      }


      if (tickets !== undefined) {
        existingEvent.tickets =
          Number(tickets);
      }


      if (ticketPrice !== undefined) {
        existingEvent.ticketPrice =
          Number(ticketPrice);
      }


      // -------------------------------------------------
      // UPDATE IMAGE
      // -------------------------------------------------

      if (req.file) {

        existingEvent.image =
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`;

      }


      // -------------------------------------------------
      // SAVE
      // -------------------------------------------------

      const updatedEvent =
        await existingEvent.save();


      console.log(
        "EVENT UPDATED:",
        updatedEvent._id
      );


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

          message:
            "Event not found"

        });

      }


      console.log(
        "EVENT DELETED:",
        deletedEvent._id
      );


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

        error:
          error.message

      });

    }

  }
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;


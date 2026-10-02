
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

          message:
            "All event fields are required"

        });

      }


      // =================================================
      // IMAGE TO BASE64
      // =================================================

      const imageBase64 =
        `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`;


      // =================================================
      // CREATE EVENT
      // =================================================

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


      console.log(
        "EVENT SAVED:",
        savedEvent._id
      );


      return res.status(201).json({

        success: true,

        message:
          "Event created successfully",

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
// Base64 image is NOT returned here.
// Only imageUrl is returned.
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


      // =================================================
      // API BASE URL
      // =================================================

      const baseUrl =
        `https://${req.get("host")}`;


      // =================================================
      // FORMAT EVENTS
      // =================================================

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

        count:
          formattedEvents.length,

        data:
          formattedEvents

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

      console.log("=================================");
      console.log(
        "IMAGE REQUEST:",
        req.params.id
      );
      console.log("=================================");


      // =================================================
      // FIND EVENT
      // =================================================

      const event =
        await eventModel
          .findById(req.params.id)
          .select("image");


      // =================================================
      // EVENT NOT FOUND
      // =================================================

      if (!event) {

        return res.status(404).json({

          success: false,

          message:
            "Event not found"

        });

      }


      // =================================================
      // IMAGE NOT FOUND
      // =================================================

      if (!event.image) {

        return res.status(404).json({

          success: false,

          message:
            "Image not found"

        });

      }


      console.log(
        "IMAGE FOUND"
      );

      console.log(
        "IMAGE TYPE:",
        typeof event.image
      );


      // =================================================
      // CASE 1
      // IMAGE IS BASE64 DATA URL
      // =================================================
      //
      // Example:
      //
      // data:image/jpeg;base64,/9j/4AAQ...
      //
      // =================================================

      if (
        typeof event.image === "string" &&
        event.image.startsWith("data:image/")
      ) {

        console.log(
          "IMAGE FORMAT: BASE64 DATA URL"
        );


        const matches =
          event.image.match(
            /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/
          );


        if (!matches) {

          return res.status(500).json({

            success: false,

            message:
              "Invalid Base64 image format"

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


        return res.send(
          imageBuffer
        );

      }


      // =================================================
      // CASE 2
      // IMAGE IS RAW BASE64
      // =================================================
      //
      // Example:
      //
      // /9j/4AAQSkZJRg...
      //
      // =================================================

      if (
        typeof event.image === "string"
      ) {

        const possibleBase64 =
          event.image.trim();


        const isBase64 =
          /^[A-Za-z0-9+/]+={0,2}$/.test(
            possibleBase64
          );


        if (isBase64) {

          console.log(
            "IMAGE FORMAT: RAW BASE64"
          );


          const imageBuffer =
            Buffer.from(
              possibleBase64,
              "base64"
            );


          res.setHeader(
            "Content-Type",
            "image/jpeg"
          );


          res.setHeader(
            "Content-Length",
            imageBuffer.length
          );


          res.setHeader(
            "Cache-Control",
            "public, max-age=86400"
          );


          return res.send(
            imageBuffer
          );

        }

      }


      // =================================================
      // CASE 3
      // IMAGE IS URL
      // =================================================

      if (
        typeof event.image === "string" &&
        (
          event.image.startsWith("http://") ||
          event.image.startsWith("https://")
        )
      ) {

        console.log(
          "IMAGE FORMAT: URL"
        );


        const imageUrl =
          event.image.replace(
            "http://",
            "https://"
          );


        return res.redirect(
          imageUrl
        );

      }


      // =================================================
      // CASE 4
      // IMAGE IS BUFFER
      // =================================================

      if (
        Buffer.isBuffer(event.image)
      ) {

        console.log(
          "IMAGE FORMAT: BUFFER"
        );


        res.setHeader(
          "Content-Type",
          "image/jpeg"
        );


        res.setHeader(
          "Content-Length",
          event.image.length
        );


        res.setHeader(
          "Cache-Control",
          "public, max-age=86400"
        );


        return res.send(
          event.image
        );

      }


      // =================================================
      // UNKNOWN IMAGE FORMAT
      // =================================================

      console.log(
        "UNKNOWN IMAGE FORMAT:"
      );

      console.log(
        event.image
      );


      return res.status(500).json({

        success: false,

        message:
          "Unsupported image format"

      });

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

          message:
            "Event not found"

        });

      }


      return res.status(200).json({

        success: true,

        data:
          event

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


      // =================================================
      // FIND EVENT
      // =================================================

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


      // =================================================
      // UPDATE FIELDS
      // =================================================

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


      // =================================================
      // UPDATE IMAGE
      // =================================================

      if (req.file) {

        existingEvent.image =
          `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`;

      }


      // =================================================
      // SAVE EVENT
      // =================================================

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

        data:
          updatedEvent

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


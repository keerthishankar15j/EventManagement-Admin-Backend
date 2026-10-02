const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const eventModel = require("../Model/EventModel");

const router = express.Router();

// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Convert uploaded image to Base64
    const imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64"
    )}`;

    const newEvent = new eventModel({
      name,
      organizer,
      date,
      time,
      location,
      description,
      category,
      tickets,
      ticketPrice,
      image: imageBase64,
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: {
        ...newEvent.toObject(),
        image: undefined,
        imageUrl: `https://${req.get("host")}/events/image/${newEvent._id}`,
      },
    });
  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
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
      .select("-image -__v")
      .sort({ createdAt: -1 });

    const baseUrl = `https://${req.get("host")}`;

    const updatedEvents = events.map((event) => ({
      ...event.toObject(),
      imageUrl: `${baseUrl}/events/image/${event._id}`,
    }));

    res.status(200).json({
      success: true,
      data: updatedEvents,
    });
  } catch (error) {
    console.error("GET EVENTS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET EVENT IMAGE
// =====================================================

router.get("/image/:id", async (req, res) => {
  try {
    const event = await eventModel
      .findById(req.params.id)
      .select("image");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    const image = event.image;

    console.log("IMAGE TYPE:", typeof image);
    console.log("IMAGE VALUE:", image);

    // =====================================================
    // CASE 1: BASE64 DATA URL
    // =====================================================

    if (
      typeof image === "string" &&
      image.startsWith("data:image/")
    ) {
      const commaIndex = image.indexOf(",");

      if (commaIndex === -1) {
        return res.status(500).json({
          success: false,
          message: "Invalid Base64 image",
        });
      }

      const header = image.substring(0, commaIndex);
      const base64Data = image.substring(commaIndex + 1);

      const mimeType = header
        .split(";")[0]
        .replace("data:", "");

      const imageBuffer = Buffer.from(base64Data, "base64");

      res.setHeader("Content-Type", mimeType);
      res.setHeader("Content-Length", imageBuffer.length);
      res.setHeader("Cache-Control", "public, max-age=86400");

      return res.send(imageBuffer);
    }

    // =====================================================
    // CASE 2: OLD UPLOADS PATH
    // Example:
    // uploads/1788679151224-263672933.webp
    // =====================================================

    if (
      typeof image === "string" &&
      image.startsWith("uploads/")
    ) {
      const filePath = path.join(process.cwd(), image);

      console.log("IMAGE FILE PATH:", filePath);

      if (!fs.existsSync(filePath)) {
        console.log("IMAGE FILE NOT FOUND:", filePath);

        return res.status(404).json({
          success: false,
          message: "Image file not found on server",
          path: image,
        });
      }

      const extension = path
        .extname(filePath)
        .toLowerCase();

      let contentType = "application/octet-stream";

      if (
        extension === ".jpg" ||
        extension === ".jpeg"
      ) {
        contentType = "image/jpeg";
      } else if (extension === ".png") {
        contentType = "image/png";
      } else if (extension === ".webp") {
        contentType = "image/webp";
      } else if (extension === ".gif") {
        contentType = "image/gif";
      }

      res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=86400");

      return res.sendFile(path.resolve(filePath));
    }

    // =====================================================
    // CASE 3: FULL IMAGE URL
    // =====================================================

    if (
      typeof image === "string" &&
      (
        image.startsWith("http://") ||
        image.startsWith("https://")
      )
    ) {
      return res.redirect(
        image.replace("http://", "https://")
      );
    }

    // =====================================================
    // CASE 4: RAW BASE64
    // =====================================================

    if (
      typeof image === "string" &&
      image.length > 100
    ) {
      try {
        const imageBuffer = Buffer.from(image, "base64");

        if (imageBuffer.length > 0) {
          let contentType = "image/jpeg";

          // JPEG
          if (
            imageBuffer[0] === 0xff &&
            imageBuffer[1] === 0xd8 &&
            imageBuffer[2] === 0xff
          ) {
            contentType = "image/jpeg";
          }

          // PNG
          else if (
            imageBuffer[0] === 0x89 &&
            imageBuffer[1] === 0x50 &&
            imageBuffer[2] === 0x4e &&
            imageBuffer[3] === 0x47
          ) {
            contentType = "image/png";
          }

          // WEBP
          else if (
            imageBuffer.toString("ascii", 0, 4) === "RIFF" &&
            imageBuffer.toString("ascii", 8, 12) === "WEBP"
          ) {
            contentType = "image/webp";
          }

          res.setHeader("Content-Type", contentType);
          res.setHeader(
            "Content-Length",
            imageBuffer.length
          );

          return res.send(imageBuffer);
        }
      } catch (error) {
        console.log("BASE64 ERROR:", error.message);
      }
    }

    // =====================================================
    // UNKNOWN FORMAT
    // =====================================================

    return res.status(500).json({
      success: false,
      message: "Unsupported image format",
      imageType: typeof image,
      imageStart: String(image).substring(0, 100),
    });
  } catch (error) {
    console.error("GET IMAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// GET SINGLE EVENT
// =====================================================

router.get("/get/:id", async (req, res) => {
  try {
    const event = await eventModel.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const eventData = event.toObject();

    eventData.imageUrl = `https://${req.get("host")}/events/image/${event._id}`;

    delete eventData.image;

    res.status(200).json({
      success: true,
      data: eventData,
    });
  } catch (error) {
    console.error("GET SINGLE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// UPDATE EVENT
// =====================================================

router.put("/update/:id", upload.single("image"), async (req, res) => {
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
      ticketPrice,
    } = req.body;

    const event = await eventModel.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.name = name;
    event.organizer = organizer;
    event.date = date;
    event.time = time;
    event.location = location;
    event.description = description;
    event.category = category;
    event.tickets = tickets;
    event.ticketPrice = ticketPrice;

    // New image uploaded
    if (req.file) {
      event.image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64"
      )}`;
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: {
        ...event.toObject(),
        image: undefined,
        imageUrl: `https://${req.get("host")}/events/image/${event._id}`,
      },
    });
  } catch (error) {
    console.error("UPDATE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// DELETE EVENT
// =====================================================

router.delete("/delete/:id", async (req, res) => {
  try {
    const event = await eventModel.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// =====================================================
// MULTER ERROR HANDLER
// =====================================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  next();
});

module.exports = router;
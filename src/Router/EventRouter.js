const express = require("express");
const multer = require("multer");

const {
  createEvent,
  getEvents,
  getSingleEvent,
  updateEvent,
  deleteEvent,
} = require("../Controller/EventController");

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
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
      );
    }
  },
});

// =====================================================
// CREATE EVENT
// POST /events/create
// =====================================================

router.post(
  "/create",
  upload.single("image"),
  createEvent
);

// =====================================================
// GET ALL EVENTS
// GET /events/getevents
// =====================================================

router.get(
  "/getevents",
  getEvents
);

// =====================================================
// GET SINGLE EVENT
// GET /events/get/:id
// =====================================================

router.get(
  "/get/:id",
  getSingleEvent
);

// =====================================================
// UPDATE EVENT
// PUT /events/update/:id
// =====================================================

router.put(
  "/update/:id",
  upload.single("image"),
  updateEvent
);

// =====================================================
// DELETE EVENT
// DELETE /events/delete/:id
// =====================================================

router.delete(
  "/delete/:id",
  deleteEvent
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;
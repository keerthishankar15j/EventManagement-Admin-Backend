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

router.post(
  "/create",
  upload.single("image"),
  createEvent
);

// =====================================================
// GET ALL EVENTS
// =====================================================

router.get(
  "/getevents",
  getEvents
);

// =====================================================
// GET SINGLE EVENT
// =====================================================

router.get(
  "/get/:id",
  getSingleEvent
);

// =====================================================
// UPDATE EVENT
// =====================================================

router.put(
  "/update/:id",
  upload.single("image"),
  updateEvent
);

// =====================================================
// DELETE EVENT
// =====================================================

router.delete(
  "/delete/:id",
  deleteEvent
);

module.exports = router;
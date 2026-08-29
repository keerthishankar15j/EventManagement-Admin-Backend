const express = require("express");

const router = express.Router();

const eventController =
  require("../Controller/EventController");

const upload =
  require("../middleware/upload");

// =====================================================
// CREATE EVENT
// =====================================================

router.post(
  "/create",
  upload.single("image"),
  eventController.createEvent
);


// =====================================================
// GET ALL EVENTS
// =====================================================

router.get(
  "/getevents",
  eventController.getEvents
);


// =====================================================
// GET SINGLE EVENT
// =====================================================

router.get(
  "/get/:id",
  eventController.getSingleEvent
);


// =====================================================
// UPDATE EVENT
// =====================================================

router.put(
  "/update/:id",
  upload.single("image"),
  eventController.updateEvent
);


// =====================================================
// DELETE EVENT
// =====================================================

router.delete(
  "/delete/:id",
  eventController.deleteEvent
);


module.exports = router;
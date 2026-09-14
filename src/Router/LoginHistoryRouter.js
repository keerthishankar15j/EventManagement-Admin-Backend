const express = require("express");

const router = express.Router();

const {
  createLoginHistoryController,
  logoutUserController,
  getAllLoginHistoryController,
  getLoginHistoryByUserController,
} = require("../Controller/LoginHistoryController");

// Create login record
router.post(
  "/login",
  createLoginHistoryController
);

// Update logout time
router.put(
  "/logout",
  logoutUserController
);

// Get all login history
router.get(
  "/history",
  getAllLoginHistoryController
);

// Get particular user history
router.get(
  "/history/:userId",
  getLoginHistoryByUserController
);

module.exports = router;
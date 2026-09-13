const express = require("express");

const router = express.Router();

const {
  getAndSyncUsers,
  getUsers,
  loginUser,
} = require("../Controller/UserController");


// Fetch from User Side + Store in Admin DB
router.get("/sync", getAndSyncUsers);


// Get users from Admin DB
router.get("/", getUsers);


// Login
router.post("/login", loginUser);


module.exports = router;
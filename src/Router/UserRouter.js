const express = require("express");

const router = express.Router();

const {
  loginuser,
  getUsers,
  getIndividualUser,
} = require("../Controller/LoginController");

// Login user
router.post("/loginuser", loginuser);

// Get all users
router.get("/getusers", getUsers);

// Get individual user
router.get("/getuser/:id", getIndividualUser);

module.exports = router;
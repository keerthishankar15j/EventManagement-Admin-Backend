const express = require("express");

const router = express.Router();

const {
  loginuser,
  getUsers,
  getIndividualUser,
} = require(
  "../Controller/LoginController"
);

// LOGIN
router.post(
  "/loginuser",
  loginuser
);

// GET ALL USERS
router.get(
  "/getusers",
  getUsers
);

// GET SINGLE USER
router.get(
  "/getuser/:id",
  getIndividualUser
);

module.exports = router;
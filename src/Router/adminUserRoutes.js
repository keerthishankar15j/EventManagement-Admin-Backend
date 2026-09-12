const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById,
} = require("../controllers/adminUserController");

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

module.exports = router;
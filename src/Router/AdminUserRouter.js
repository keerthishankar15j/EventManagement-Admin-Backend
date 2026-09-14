const express = require("express");

const router = express.Router();

const {
  receiveUser,
  getUsers,
  getUserById,
} = require("../Controller/AdminUserController");


// User Backend → Admin Backend
router.post(
  "/sync-user",
  receiveUser
);


// Admin Frontend → Admin Backend
router.get(
  "/users",
  getUsers
);


// Admin Frontend → Single User
router.get(
  "/users/:id",
  getUserById
);


module.exports = router;
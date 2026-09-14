const express = require("express");

const router = express.Router();

const {
  receiveUser,
  getAdminUsers,
  getAdminUserById,
} = require("../Controller/AdminUserController");


// User Backend → Admin Backend
router.post(
  "/sync-user",
  receiveUser
);


// Admin Frontend → Admin Backend
router.get(
  "/users",
  getAdminUsers
);


// Admin Frontend → Single User
router.get(
  "/users/:id",
  getAdminUserById
);


module.exports = router;
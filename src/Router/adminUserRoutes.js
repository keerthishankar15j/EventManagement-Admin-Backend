const express = require("express");

const router = express.Router();

const {
  getAllUsers,
  getUserById,
} = require("../Controller/adminUserController");


// =====================================================
// GET ALL USERS
// =====================================================

router.get(
  "/users",
  getAllUsers
);


// =====================================================
// GET SINGLE USER
// =====================================================

router.get(
  "/users/:id",
  getUserById
);


module.exports = router;
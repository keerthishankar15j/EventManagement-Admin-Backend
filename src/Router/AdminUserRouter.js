const express = require("express");

const router = express.Router();


const {

  syncUserController,

  getUsersController,

  getSingleUserController,

} = require(
  "../Controller/AdminUserController"
);


// ======================================================
// USER BACKEND → ADMIN
// ======================================================

router.post(
  "/sync-user",
  syncUserController
);


// ======================================================
// ADMIN FRONTEND → GET ALL USERS
// ======================================================

router.get(
  "/users",
  getUsersController
);


// ======================================================
// ADMIN FRONTEND → GET SINGLE USER
// ======================================================

router.get(
  "/users/:id",
  getSingleUserController
);


module.exports = router;
const express = require("express");

const router = express.Router();

const {
  syncUsersController,
  getAdminUsersController,
  getAdminUserByIdController,
} = require("../Controller/AdminUserController");

router.post(
  "/sync-users",
  syncUsersController
);

router.get(
  "/users",
  getAdminUsersController
);

router.get(
  "/users/:id",
  getAdminUserByIdController
);

module.exports = router;
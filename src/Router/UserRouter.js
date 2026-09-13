const express = require("express");

const router = express.Router();


// =====================================================
// LOGIN CONTROLLER
// =====================================================

const {
  loginuser,
  getUsers,
  getIndividualUser,
} = require("../Controller/LoginController");


// =====================================================
// LOGIN USER
// =====================================================

router.post(
  "/loginuser",
  loginuser
);


// =====================================================
// GET ALL USERS
// =====================================================

router.get(
  "/getusers",
  getUsers
);


// =====================================================
// GET INDIVIDUAL USER
// =====================================================

router.get(
  "/getuser/:id",
  getIndividualUser
);


// =====================================================
// EXPORT
// =====================================================

module.exports = router;
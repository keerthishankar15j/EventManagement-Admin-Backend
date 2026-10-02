const express = require("express");

const BookTicketModel = require("../Model/BookTicketModel");

const router = express.Router();

router.get("/getbookings", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "BookTicketModel imported successfully",
    modelName: BookTicketModel.modelName,
  });
});

module.exports = router;
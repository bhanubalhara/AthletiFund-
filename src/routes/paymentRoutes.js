const express = require("express");
const router = express.Router();
const { createOrder } = require("../controllers/paymentController");

// Mock payment endpoint
router.post("/create-order", createOrder);

module.exports = router;

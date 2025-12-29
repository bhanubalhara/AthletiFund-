const express = require("express");
const router = express.Router();
const { getFundStatus } = require("../controllers/fundController");

router.get("/", getFundStatus);

module.exports = router;

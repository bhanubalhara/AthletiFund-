const express = require("express");
const router = express.Router();
const { makeDonation } = require("../controllers/donationController");

router.post("/", makeDonation);

module.exports = router;

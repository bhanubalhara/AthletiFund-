const express = require("express");
const router = express.Router();

const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  verifyCampaign
} = require("../controllers/campaignController");

const { protect } = require("../middlewares/authMiddleware");
const { adminOnly } = require("../middlewares/roleMiddleware");

// Athlete
router.post("/", protect, createCampaign);
router.put("/:id", protect, updateCampaign);
router.delete("/:id", protect, deleteCampaign);

// Public
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);

// Admin
router.put("/:id/verify", protect, adminOnly, verifyCampaign);

module.exports = router;

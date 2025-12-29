const Campaign = require("../models/Campaign");
const FundPool = require("../models/FundPool");

/**
 * FIXED PAYOUT RULES
 */
const PAYOUT_MAP = {
  District: 10000,
  State: 50000,
  National: 100000,
  International: 200000
};

// CREATE CAMPAIGN (Athlete)
exports.createCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.create({
      athlete: req.user.id,
      title: req.body.title,
      sport: req.body.sport,
      level: req.body.level,
      achievementYear: req.body.achievementYear,
      description: req.body.description,
      payoutAmount: PAYOUT_MAP[req.body.level],
      status: "pending"
    });

    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// READ ALL CAMPAIGNS (Public)
exports.getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("athlete", "name");
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ SINGLE CAMPAIGN
exports.getCampaignById = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).populate(
      "athlete",
      "name"
    );

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(campaign);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE CAMPAIGN (Athlete – before verification)
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (campaign.status === "verified") {
      return res.status(400).json({ error: "Verified campaign cannot be edited" });
    }

    Object.assign(campaign, req.body);
    await campaign.save();

    res.json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE CAMPAIGN
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findByIdAndDelete(req.params.id);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VERIFY CAMPAIGN + PAYOUT (ADMIN ONLY)
exports.verifyCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    if (campaign.status === "verified") {
      return res.status(400).json({ error: "Campaign already verified" });
    }

    let fund = await FundPool.findOne();
    if (!fund) {
      fund = await FundPool.create({});
    }

    if (fund.totalAmount < campaign.payoutAmount) {
      return res.status(400).json({ error: "Insufficient fund pool" });
    }

    // Deduct fund & verify
    fund.totalAmount -= campaign.payoutAmount;
    campaign.status = "verified";

    await fund.save();
    await campaign.save();

    res.json({
      message: "Campaign verified & payout released",
      payoutAmount: campaign.payoutAmount,
      remainingFund: fund.totalAmount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

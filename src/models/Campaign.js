const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    title: {
      type: String,
      required: true
    },
    sport: {
      type: String,
      required: true
    },
    level: {
      type: String,
      enum: ["District", "State", "National", "International"],
      required: true
    },
    achievementYear: {
      type: Number,
      required: true
    },
    description: {
      type: String
    },
    payoutAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Campaign", campaignSchema);

const mongoose = require("mongoose");

const fundPoolSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("FundPool", fundPoolSchema);

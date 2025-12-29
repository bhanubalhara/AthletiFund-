const FundPool = require("../models/FundPool");

exports.getFundStatus = async (req, res) => {
  let fund = await FundPool.findOne();
  if (!fund) {
    fund = await FundPool.create({});
  }

  res.json({
    totalFund: fund.totalAmount
  });
};

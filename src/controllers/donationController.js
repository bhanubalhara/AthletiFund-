const Donation = require("../models/Donation");
const FundPool = require("../models/FundPool");
const { v4: uuidv4 } = require("uuid");

exports.makeDonation = async (req, res) => {
  const { amount } = req.body;

  let fund = await FundPool.findOne();
  if (!fund) {
    fund = await FundPool.create({});
  }

  const donation = await Donation.create({
    donorId: "DON-" + uuidv4().slice(0, 6),
    amount
  });

  fund.totalAmount += amount;
  await fund.save();

  res.status(201).json({
    message: "Donation successful",
    donorId: donation.donorId,
    fundTotal: fund.totalAmount
  });
};

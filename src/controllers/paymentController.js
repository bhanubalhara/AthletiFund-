exports.createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Mock payment response
    res.json({
      id: "mock_order_" + Date.now(),
      amount: amount * 100, // paise
      currency: "INR",
      status: "created",
      paymentMode: "mock"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const express = require("express");
console.log("🔥🔥 REAL SERVER.JS LOADED 🔥🔥");

const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

// Load .env explicitly
require("dotenv").config({
  path: path.resolve(__dirname, "..", ".env")
});

// Routes
const authRoutes = require("./routes/auth");
const campaignRoutes = require("./routes/campaignRoutes");
const donationRoutes = require("./routes/donationRoutes");
const fundRoutes = require("./routes/fundRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes mounting
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/fund", fundRoutes);
app.use("/api/payments", paymentRoutes); // ✅ ADDED

// Health check
app.get("/", (req, res) => {
  res.send("AthletiFund Backend Running 🚀");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.error("MongoDB error:", err));

// Start server only if run directly
const PORT = process.env.PORT || 5000;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
  });
}

// Global error handler (LAST)
app.use((err, req, res, next) => {
  console.error("UNCAUGHT ERROR:", err.stack || err);
  res.status(500).json({
    error: err.message || "Internal Server Error"
  });
});

module.exports = app;

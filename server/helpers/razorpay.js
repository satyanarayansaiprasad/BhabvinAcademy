const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "missing_key_id",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "missing_key_secret",
});

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn("WARNING: Razorpay API keys are missing. Payment features will fail.");
}

module.exports = razorpayInstance;

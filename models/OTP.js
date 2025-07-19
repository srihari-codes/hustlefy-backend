const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: Number, required: true },
  expiration: { type: Date, required: true },
});

module.exports = mongoose.model("OTP", otpSchema);
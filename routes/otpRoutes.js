const express = require("express");
const { body } = require("express-validator");
const { sendOtp, verifyOtp } = require("../controllers/otpController");

const router = express.Router();

// Validation rules
const otpValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
];

const verifyOtpValidation = [
  body("email").isEmail().normalizeEmail().withMessage("Please provide a valid email"),
  body("otp").isNumeric().withMessage("OTP must be a number"),
];

// Routes
router.post("/send-otp", otpValidation, sendOtp);
router.post("/verify-otp", verifyOtpValidation, verifyOtp);

module.exports = router;
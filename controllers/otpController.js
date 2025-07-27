const crypto = require("crypto");
const nodemailer = require("nodemailer");
const OTP = require("../models/OTP");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email already exists in the User model
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered. Please log in.",
      });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999);

    // Store OTP in the database with expiration
    const expiration = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await OTP.create({ email, otp, expiration });

    // Send OTP via email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp, password } = req.body; // Include password in the request body

    // Find OTP in the database
    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Check expiration
    if (record.expiration < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (!user) {
      // Create a new user with email, password, and isEmailVerified
      user = await User.create({
        email,
        password, // Password will be hashed automatically by the pre-save hook in the User model
        isEmailVerified: true,
      });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id, // ← Changed from userId to id
          email: user.email,
          name: user.name || null, // ← Added missing name field
          role: user.role || null,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE || "7d",
        }
      );

      return res.status(201).json({
        success: true,
        message: "Email verified and user created successfully",
        user,
        token, // Include token in the response
      });
    } else {
      // Mark email as verified for existing user
      await User.findOneAndUpdate({ email }, { isEmailVerified: true });

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id, // ← Changed from userId to id
          email: user.email,
          name: user.name || null, // ← Added missing name field
          role: user.role || null,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRE || "7d",
        }
      );

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user,
        token, // Include token in the response
      });
    }
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
};

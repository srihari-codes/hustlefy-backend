const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload)
      return res.status(400).json({ message: "Invalid Google token" });

    const {
      sub: googleId,
      email,
      name,
      picture: profilePicture,
      email_verified,
    } = payload;
    if (!email_verified)
      return res.status(400).json({ message: "Email not verified by Google" });

    let user = await User.findOne({ $or: [{ email }, { googleId }] });
    let isNewUser = false;

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        user.profilePicture = profilePicture || user.profilePicture;
        await user.save();
      }
    } else {
      user = new User({
        email,
        name,
        googleId,
        profilePicture,
        role: "seeker",
        isEmailVerified: true,
      });
      await user.save();
      isNewUser = true; // Mark as a new user
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response based on whether the user is new or existing
    const responseUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      profilePicture: user.profilePicture,
      googleId: user.googleId,
    };

    if (!isNewUser) {
      responseUser.location = user.location; // Include location only for existing users
      if (user.role === "seeker") {
        responseUser.workCategories = user.workCategories || []; // Include workCategories for seeker profiles
      }
    }

    res.json({
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("pass 0");
    // Check if user exists and has a password
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("pass 1");
    // Validate password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("pass 2");

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Send response
    const responseUser = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      profilePicture: user.profilePicture,
      googleId: user.googleId,
    };

    if (user.role === "seeker") {
      responseUser.workCategories = user.workCategories || []; // Include workCategories for seeker profiles
    }

    res.json({
      token,
      user: responseUser,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

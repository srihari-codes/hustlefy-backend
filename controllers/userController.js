const { validationResult } = require("express-validator");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { name, phone, role, workCategories, bio } = req.body;
    const user = await User.findById(req.user.id);

    // Update user fields
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (role) user.role = role; // Role is being set for the first time

    // Only update these fields if user is NOT a provider
    if (user.role !== "provider") {
      if (workCategories) user.workCategories = workCategories;
      if (bio !== undefined) user.bio = bio;
    }

    await user.save();

    // Generate NEW token with updated role and name
    const newToken = jwt.sign(
      {
        id: user._id, // Changed from userId to id
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
      token: newToken, // Return new token with correct role
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
};

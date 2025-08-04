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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update basic fields (available to both providers and seekers)
    if (name !== undefined) user.name = name;
    if (phone !== undefined) {
      user.phone = phone ? phone.replace(/\s+/g, "") : phone;
    }

    // Handle role updates
    if (role !== undefined) {
      user.role = role;

      if (role === "seeker") {
        // Validate seeker requirements
        if (!workCategories || workCategories.length === 0) {
          return res.status(400).json({
            success: false,
            message: "Work categories are required for seekers",
          });
        }
        if (!bio || bio.trim().length === 0) {
          return res.status(400).json({
            success: false,
            message: "Bio is required for seekers",
          });
        }
        user.workCategories = workCategories;
        user.bio = bio;
      } else if (role === "provider") {
        // Clear seeker-specific fields for providers
        user.workCategories = [];
        user.bio = "";
      }
    } else {
      // Handle updates when role is not changing
      if (user.role === "seeker") {
        // Update workCategories if provided
        if (workCategories !== undefined) {
          if (!workCategories || workCategories.length === 0) {
            return res.status(400).json({
              success: false,
              message: "Work categories are required for seekers",
            });
          }
          user.workCategories = workCategories;
        }

        // Update bio if provided
        if (bio !== undefined) {
          if (!bio || bio.trim().length === 0) {
            return res.status(400).json({
              success: false,
              message: "Bio is required for seekers",
            });
          }
          user.bio = bio;
        }
      } else if (user.role === "provider") {
        // Providers can only update workCategories and bio if they're trying to set them (which is not allowed)
        if (workCategories !== undefined && workCategories.length > 0) {
          return res.status(400).json({
            success: false,
            message: "Providers cannot have work categories",
          });
        }
        if (bio !== undefined && bio.trim().length > 0) {
          return res.status(400).json({
            success: false,
            message: "Providers cannot have a bio",
          });
        }
        // Clear these fields if they somehow exist
        if (workCategories !== undefined) user.workCategories = [];
        if (bio !== undefined) user.bio = "";
      }
    }

    // Save the user
    await user.save();

    // Generate new token with updated user data
    const newToken = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
      token: newToken,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Add a helper function to check if user profile is complete
const isProfileComplete = (user) => {
  if (!user.name || !user.role || !user.email) return false;

  if (user.role === "seeker") {
    return !!(
      user.workCategories &&
      user.workCategories.length > 0 &&
      user.bio
    );
  }

  return true; // Providers only need name, role, email
};

module.exports = {
  getProfile,
  updateProfile,
  isProfileComplete,
};

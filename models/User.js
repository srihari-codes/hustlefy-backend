const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [false, "Name is optional"],
      trim: true,
      maxlength: [50, "Name cannot exceed 50 characters"],
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          // Only letters, spaces, hyphens, apostrophes
          return /^[a-zA-Z\s\-']+$/.test(v);
        },
        message:
          "Name can only contain letters, spaces, hyphens, and apostrophes",
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password not required for Google users
      },
      minlength: [6, "Password must be at least 6 characters"],
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // Optional field
          // E.164 format validation
          return /^\+[1-9]\d{1,14}$/.test(v);
        },
        message: "Phone must be in E.164 format (e.g., +1234567890)",
      },
    },
    workCategories: {
      type: [String],
      enum: [
        "Setup & Events",
        "Cleaning",
        "Logistics & Warehouse",
        "Food Service",
        "Heavy Lifting",
        "Maintenance",
        "Landscaping",
        "Administrative",
        "Customer Service",
        "Delivery",
      ],
      // Remove the custom validator - we'll handle this in the controller
    },
    bio: {
      type: String,
      maxlength: [300, "Bio cannot exceed 300 characters"],
      // Remove the custom validator - we'll handle this in the controller
      set: function (bio) {
        if (!bio) return bio;
        // Strip HTML tags
        return bio.replace(/<[^>]*>/g, "").trim();
      },
    },
    role: {
      type: String,
      enum: ["provider", "seeker"],
      required: [false, "Role will be set during onboarding"], // Make it optional initially
    },
    profilePicture: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);

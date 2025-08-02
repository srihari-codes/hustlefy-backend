const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [50, "Title cannot exceed 50 characters"], // Changed from 200 to 50
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"], // Changed from 2000 to 500
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
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
    },
    peopleNeeded: {
      type: Number,
      required: [true, "Number of people needed is required"],
      min: [1, "At least 1 person is required"],
      max: [50, "Cannot exceed 50 people"],
    },
    peopleAccepted: {
      type: Number,
      default: 0,
      min: 0,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    payment: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment cannot be negative"],
    },
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    providerName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "fulfilled"],
      default: "open",
    },
    acceptedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-update status when peopleAccepted reaches peopleNeeded
jobSchema.pre("save", function (next) {
  if (this.peopleAccepted >= this.peopleNeeded) {
    this.status = "fulfilled";
  }
  next();
});

// Index for efficient queries
jobSchema.index({ location: 1, category: 1, status: 1 });
jobSchema.index({ providerId: 1 });

module.exports = mongoose.model("Job", jobSchema);

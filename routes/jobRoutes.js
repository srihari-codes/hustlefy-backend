const express = require("express");
const { body } = require("express-validator");
const {
  getJobs,
  getJob,
  createJob,
  getMyJobs,
  applyForJob,
  getJobApplicants,
  acceptApplicant,
  rejectApplicant,
  getMyApplications,
  deleteJob,
} = require("../controllers/jobController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Validation rules
const createJobValidation = [
  body("title")
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("Title must be between 5 and 200 characters"),
  body("description")
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("category")
    .isIn([
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
    ])
    .withMessage("Invalid category"),
  body("peopleNeeded")
    .isInt({ min: 1, max: 50 })
    .withMessage("People needed must be between 1 and 50"),
  body("duration").trim().notEmpty().withMessage("Duration is required"),
  body("payment")
    .isFloat({ min: 0 })
    .withMessage("Payment must be a positive number"),
];

const applyJobValidation = [
  body("message")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Message cannot exceed 1000 characters"),
];

// Public routes
router.get("/", getJobs);
router.get("/:id", getJob);

// Protected routes
router.use(authMiddleware);

// Provider routes
router.post("/", roleMiddleware(["provider"]), createJobValidation, createJob);
router.get("/my/jobs", roleMiddleware(["provider"]), getMyJobs);
router.get("/:id/applicants", roleMiddleware(["provider"]), getJobApplicants);
router.post(
  "/:id/accept/:applicationId",
  roleMiddleware(["provider"]),
  acceptApplicant
);
router.post(
  "/:id/reject/:applicationId",
  roleMiddleware(["provider"]),
  rejectApplicant
);
router.delete("/:id", roleMiddleware(["provider"]), deleteJob);

// Seeker routes
router.post(
  "/:id/apply",
  roleMiddleware(["seeker"]),
  applyJobValidation,
  applyForJob
);
router.get("/my/applications", roleMiddleware(["seeker"]), getMyApplications);

module.exports = router;

const { validationResult } = require("express-validator");
const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const nodemailer = require("nodemailer");

// @desc    Get all jobs (public)
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const { category, location, search } = req.query;

    let query = { status: "open" };

    // Add filters
    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(query)
      .populate("providerId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "providerId",
      "name email phone"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Get job error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private (Provider only)
const createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      location,
      category,
      peopleNeeded,
      duration,
      payment,
    } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      category,
      peopleNeeded,
      duration,
      payment,
      providerId: req.user.id,
      providerName: req.user.name,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      data: job,
    });
  } catch (error) {
    console.error("Create job error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get provider's jobs
// @route   GET /api/jobs/my
// @access  Private (Provider only)
const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ providerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: jobs.length,
      data: jobs,
    });
  } catch (error) {
    console.error("Get my jobs error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Apply for a job
// @route   POST /api/jobs/:id/apply
// @access  Private (Seeker only)
const applyForJob = async (req, res) => {
  try {
    const { message } = req.body;
    const jobId = req.params.id;

    // Check if job exists and is open
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Job is no longer accepting applications",
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId,
      seekerId: req.user.id,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Create application
    const application = await Application.create({
      jobId,
      seekerId: req.user.id,
      seekerName: req.user.name,
      seekerBio: req.user.bio,
      seekerCategories: req.user.workCategories,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
  } catch (error) {
    console.error("Apply for job error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get job applicants
// @route   GET /api/jobs/:id/applicants
// @access  Private (Provider only)
const getJobApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    // Verify job belongs to the provider
    const job = await Job.findOne({ _id: jobId, providerId: req.user.id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    const applications = await Application.find({ jobId })
      .populate("seekerId", "name email phone location workCategories bio")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get job applicants error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Accept job applicant
// @route   POST /api/jobs/:id/accept/:applicationId
// @access  Private (Provider only)
const acceptApplicant = async (req, res) => {
  try {
    const { id: jobId, applicationId } = req.params;

    // Verify job belongs to the provider
    const job = await Job.findOne({ _id: jobId, providerId: req.user.id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    // Check if job is still open
    if (job.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Job is no longer accepting applications",
      });
    }

    // Check if already at capacity
    if (job.peopleAccepted >= job.peopleNeeded) {
      return res.status(400).json({
        success: false,
        message: "Job is already at full capacity",
      });
    }

    // Find and update application
    const application = await Application.findOne({
      _id: applicationId,
      jobId,
      status: "pending",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or already processed",
      });
    }

    // Update application status
    application.status = "accepted";
    await application.save();

    // Update job
    job.peopleAccepted += 1;
    job.acceptedUsers.push(application.seekerId);
    if (job.peopleAccepted >= job.peopleNeeded) {
      job.status = "fulfilled";
    }
    await job.save();

    // Fetch provider details
    const provider = await User.findById(job.providerId);

    // Fetch seeker details
    const seeker = await User.findById(application.seekerId);

    // Prepare email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: seeker.email,
      subject: `Welcome to "${job.title}" job!`,
      text: `
Congratulations, you have been accepted for the job "${job.title}"!

Job Details:
- Title: ${job.title}
- Payment: ${job.payment}
- Provider Email: ${provider.email}
${provider.phone ? `- Provider Phone: ${provider.phone}` : ""}

We are excited to have you onboard. Please reach out to the provider for further instructions.

Best regards,
The Hustlefy Team
      `,
    };

    // Send email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Applicant accepted successfully",
      data: {
        application,
        job: {
          id: job._id,
          peopleAccepted: job.peopleAccepted,
          peopleNeeded: job.peopleNeeded,
          status: job.status,
        },
      },
    });
  } catch (error) {
    console.error("Accept applicant error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Reject job applicant
// @route   POST /api/jobs/:id/reject/:applicationId
// @access  Private (Provider only)
const rejectApplicant = async (req, res) => {
  try {
    const { id: jobId, applicationId } = req.params;

    // Verify job belongs to the provider
    const job = await Job.findOne({ _id: jobId, providerId: req.user.id });
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    // Find and update application
    const application = await Application.findOne({
      _id: applicationId,
      jobId,
      status: "pending",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found or already processed",
      });
    }

    // Update application status
    application.status = "rejected";
    await application.save();

    res.json({
      success: true,
      message: "Applicant rejected",
      data: application,
    });
  } catch (error) {
    console.error("Reject applicant error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/my-applications
// @access  Private (Seeker only)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seekerId: req.user.id })
      .populate(
        "jobId",
        "title description location category payment duration status"
      )
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Provider only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      providerId: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or access denied",
      });
    }

    // Delete associated applications
    await Application.deleteMany({ jobId: req.params.id });

    // Delete job
    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete job error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
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
};

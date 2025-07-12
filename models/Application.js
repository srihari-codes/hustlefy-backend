const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  seekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seekerName: {
    type: String,
    required: true
  },
  seekerBio: {
    type: String
  },
  seekerCategories: [{
    type: String
  }],
  message: {
    type: String,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate applications
applicationSchema.index({ jobId: 1, seekerId: 1 }, { unique: true });

module.exports = mongoose.model('Application', applicationSchema);
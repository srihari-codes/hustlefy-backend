const express = require('express');
const { body } = require('express-validator');
const { getProfile, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('phone')
    .optional()
    .trim(),
  body('location')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Location cannot be empty'),
  body('workCategories')
    .optional()
    .isArray()
    .withMessage('Work categories must be an array'),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters')
];

// Routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfileValidation, updateProfile);

module.exports = router;
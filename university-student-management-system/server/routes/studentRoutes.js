const express = require('express');
const { body } = require('express-validator');
const studentController = require('../controllers/studentController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

// List students (admin only)
router.get('/', authenticate, authorize('admin'), studentController.getStudents);

// Get student by ID (admin or student viewing own)
router.get('/:id', authenticate, studentController.getStudent);

// Create student (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
  ],
  studentController.createStudent
);

// Update student (admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('full_name').optional().notEmpty().withMessage('Full name cannot be empty'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
  ],
  studentController.updateStudent
);

// Delete student (admin only)
router.delete('/:id', authenticate, authorize('admin'), studentController.deleteStudent);

module.exports = router;
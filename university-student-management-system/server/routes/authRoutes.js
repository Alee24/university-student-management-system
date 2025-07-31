const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

const router = express.Router();

// Register a new user (admin or student).  In production you may wish
// to restrict this to authenticated admins.  The body must include
// username, password, role, full_name.  email and department_id are optional.
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['admin', 'student']).withMessage('Role must be admin or student'),
    body('full_name').notEmpty().withMessage('Full name is required'),
    body('email').optional().isEmail().withMessage('Email must be valid'),
  ],
  authController.register
);

// Login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  authController.login
);

// Get authenticated user details
router.get('/me', authenticate, authController.getMe);

module.exports = router;
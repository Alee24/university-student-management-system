const express = require('express');
const { body } = require('express-validator');
const departmentController = require('../controllers/departmentController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

// Get all departments (public after authentication)
router.get('/', authenticate, departmentController.getDepartments);

// Get a department
router.get('/:id', authenticate, departmentController.getDepartment);

// Create a department (admin only)
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional(),
  ],
  departmentController.createDepartment
);

// Update a department (admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('description').optional(),
  ],
  departmentController.updateDepartment
);

// Delete a department (admin only)
router.delete('/:id', authenticate, authorize('admin'), departmentController.deleteDepartment);

module.exports = router;
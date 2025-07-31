const express = require('express');
const { body } = require('express-validator');
const courseController = require('../controllers/courseController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

// Public: get all courses (optional departmentId query)
router.get('/', authenticate, courseController.getCourses);

// Get course details (includes enrolled students)
router.get('/:id', authenticate, courseController.getCourse);

// Admin: create course
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('code').notEmpty().withMessage('Course code is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('department_id').optional().isInt().withMessage('Department ID must be an integer'),
  ],
  courseController.createCourse
);

// Admin: update course
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  [
    body('code').optional().notEmpty().withMessage('Course code cannot be empty'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('department_id').optional().isInt().withMessage('Department ID must be an integer'),
  ],
  courseController.updateCourse
);

// Admin: delete course
router.delete('/:id', authenticate, authorize('admin'), courseController.deleteCourse);

// Admin: enroll student into a course
router.post('/enroll', authenticate, authorize('admin'), courseController.enrollStudent);

// Admin: remove student from course
router.delete('/enroll', authenticate, authorize('admin'), courseController.removeEnrollment);

module.exports = router;
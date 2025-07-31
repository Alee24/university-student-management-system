const express = require('express');
const { body } = require('express-validator');
const gradeController = require('../controllers/gradeController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

// Admin: assign or update a grade
router.post(
  '/',
  authenticate,
  authorize('admin'),
  [
    body('studentId').isInt().withMessage('studentId must be an integer'),
    body('courseId').isInt().withMessage('courseId must be an integer'),
    body('gradeValue').notEmpty().withMessage('gradeValue is required'),
  ],
  gradeController.assignGrade
);

// Admin: delete a grade
router.delete('/', authenticate, authorize('admin'), gradeController.deleteGrade);

// Get grades for a student (admin or the student themself)
router.get('/student/:id?', authenticate, gradeController.getGradesForStudent);

// Admin: get grades for a course
router.get('/course/:courseId', authenticate, authorize('admin'), gradeController.getGradesForCourse);

module.exports = router;
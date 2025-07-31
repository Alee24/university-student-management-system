const express = require('express');
const reportController = require('../controllers/reportController');
const authenticate = require('../middleware/authMiddleware');
const authorize = require('../middleware/roleMiddleware');

const router = express.Router();

// Student report (admin or self)
router.get('/student/:studentId', authenticate, reportController.getStudentReport);

// Course report (admin only)
router.get('/course/:courseId', authenticate, authorize('admin'), reportController.getCourseReport);

module.exports = router;
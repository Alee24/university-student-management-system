const reportModel = require('../models/reportModel');

// Generate student performance summary (Admin or Student for their own)
async function getStudentReport(req, res, next) {
  try {
    const { studentId } = req.params;
    // Students can only access their own report
    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const summary = await reportModel.getStudentPerformanceSummary(studentId);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
}

// Generate course performance summary (Admin only)
async function getCourseReport(req, res, next) {
  try {
    const { courseId } = req.params;
    const summary = await reportModel.getCoursePerformanceSummary(courseId);
    res.json({ summary });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStudentReport,
  getCourseReport,
};
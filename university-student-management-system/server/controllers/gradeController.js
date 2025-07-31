const { validationResult } = require('express-validator');
const gradeModel = require('../models/gradeModel');

// Admin: assign or update a grade for a student in a course
async function assignGrade(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { studentId, courseId, gradeValue } = req.body;
    await gradeModel.addGrade(studentId, courseId, gradeValue);
    res.status(201).json({ message: 'Grade assigned' });
  } catch (err) {
    next(err);
  }
}

// Admin: delete a grade for a student/course
async function deleteGrade(req, res, next) {
  try {
    const { studentId, courseId } = req.body;
    await gradeModel.deleteGrade(studentId, courseId);
    res.json({ message: 'Grade deleted' });
  } catch (err) {
    next(err);
  }
}

// Get grades for a student (student can only view their own, admin can specify studentId)
async function getGradesForStudent(req, res, next) {
  try {
    const { id } = req.params;
    const studentId = id || req.user.id;
    // If current user is student, ensure they can only access their own grades
    if (req.user.role === 'student' && req.user.id !== Number(studentId)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const grades = await gradeModel.getGradesByStudent(studentId);
    res.json({ grades });
  } catch (err) {
    next(err);
  }
}

// Admin: get grades for a course
async function getGradesForCourse(req, res, next) {
  try {
    const { courseId } = req.params;
    const grades = await gradeModel.getGradesByCourse(courseId);
    res.json({ grades });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  assignGrade,
  deleteGrade,
  getGradesForStudent,
  getGradesForCourse,
};
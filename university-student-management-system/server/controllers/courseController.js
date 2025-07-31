const { validationResult } = require('express-validator');
const courseModel = require('../models/courseModel');
const enrollmentModel = require('../models/enrollmentModel');

// List courses. Supports optional departmentId filter.
async function getCourses(req, res, next) {
  try {
    const { departmentId } = req.query;
    const courses = await courseModel.getAllCourses({ departmentId });
    res.json({ courses });
  } catch (err) {
    next(err);
  }
}

// Get a single course by ID with enrolled students and maybe other details.
async function getCourse(req, res, next) {
  try {
    const { id } = req.params;
    const course = await courseModel.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    // fetch enrolled students
    const students = await enrollmentModel.getStudentsByCourse(id);
    res.json({ course, students });
  } catch (err) {
    next(err);
  }
}

// Create a new course.  Admin only.
async function createCourse(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { code, title, description, department_id } = req.body;
    // Attempt to create course
    const newCourse = await courseModel.createCourse({ code, title, description, department_id });
    res.status(201).json({ course: newCourse });
  } catch (err) {
    // Duplicate code error handling
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Course code already exists' });
    }
    next(err);
  }
}

// Update a course. Admin only.
async function updateCourse(req, res, next) {
  try {
    const { id } = req.params;
    const course = await courseModel.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    const data = { ...req.body };
    delete data.id;
    await courseModel.updateCourse(id, data);
    const updated = await courseModel.getCourseById(id);
    res.json({ course: updated });
  } catch (err) {
    next(err);
  }
}

// Delete a course. Admin only.
async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params;
    const course = await courseModel.getCourseById(id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    await courseModel.deleteCourse(id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    next(err);
  }
}

// Enroll a student into a course.  Admin only.
async function enrollStudent(req, res, next) {
  try {
    const { courseId, studentId } = req.body;
    if (!courseId || !studentId) {
      return res.status(400).json({ message: 'courseId and studentId are required' });
    }
    const enrollment = await enrollmentModel.enrollStudent(studentId, courseId);
    res.status(201).json({ enrollment });
  } catch (err) {
    // handle duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Student is already enrolled in this course' });
    }
    next(err);
  }
}

// Remove a student from a course. Admin only.
async function removeEnrollment(req, res, next) {
  try {
    const { courseId, studentId } = req.body;
    if (!courseId || !studentId) {
      return res.status(400).json({ message: 'courseId and studentId are required' });
    }
    await enrollmentModel.removeEnrollment(studentId, courseId);
    res.json({ message: 'Enrollment removed' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollStudent,
  removeEnrollment,
};
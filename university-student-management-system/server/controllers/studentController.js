const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const enrollmentModel = require('../models/enrollmentModel');
const gradeModel = require('../models/gradeModel');

/**
 * Returns a paginated list of students.  Admin only.  Supports
 * optional `search` query parameter and `departmentId` for filtering.
 */
async function getStudents(req, res, next) {
  try {
    const { search, departmentId, page, limit } = req.query;
    const students = await userModel.getStudents({ search, departmentId, page: Number(page) || 1, limit: Number(limit) || 10 });
    // Remove password fields
    const sanitized = students.map(s => {
      const copy = { ...s };
      delete copy.password;
      return copy;
    });
    res.json({ students: sanitized });
  } catch (err) {
    next(err);
  }
}

/**
 * Returns details for a single student by ID.  Admins can view any
 * student; a student can only view their own record.  Includes
 * enrolled courses and grades.
 */
async function getStudent(req, res, next) {
  try {
    const { id } = req.params;
    // Only allow students to access their own record
    if (req.user.role === 'student' && req.user.id !== Number(id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const student = await userModel.findById(id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    // Fetch courses and grades
    const courses = await enrollmentModel.getEnrollmentsByStudent(id);
    const grades = await gradeModel.getGradesByStudent(id);
    const result = { ...student };
    delete result.password;
    result.courses = courses;
    result.grades = grades;
    res.json({ student: result });
  } catch (err) {
    next(err);
  }
}

/**
 * Creates a student account.  Admin only.  Body fields: username,
 * password, full_name, email, department_id.  Role is forced to
 * 'student'.
 */
async function createStudent(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { username, password, full_name, email, department_id } = req.body;
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const newUser = await userModel.createUser({
      username,
      password: hash,
      role: 'student',
      full_name,
      email,
      department_id,
    });
    delete newUser.password;
    res.status(201).json({ student: newUser });
  } catch (err) {
    next(err);
  }
}

/**
 * Updates a student record.  Admin only.
 */
async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    // Validate that the record is a student
    const student = await userModel.findById(id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    const data = { ...req.body };
    // Remove fields that should not be updated via this route
    delete data.role;
    delete data.password;
    if (data.username) {
      // Ensure new username is not taken by someone else
      const userWithUsername = await userModel.findByUsername(data.username);
      if (userWithUsername && userWithUsername.id !== Number(id)) {
        return res.status(400).json({ message: 'Username already in use' });
      }
    }
    await userModel.updateUser(id, data);
    const updated = await userModel.findById(id);
    delete updated.password;
    res.json({ student: updated });
  } catch (err) {
    next(err);
  }
}

/**
 * Deletes a student record.  Admin only.
 */
async function deleteStudent(req, res, next) {
  try {
    const { id } = req.params;
    // Validate the record exists and is a student
    const student = await userModel.findById(id);
    if (!student || student.role !== 'student') {
      return res.status(404).json({ message: 'Student not found' });
    }
    await userModel.deleteUser(id);
    res.json({ message: 'Student deleted' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
};
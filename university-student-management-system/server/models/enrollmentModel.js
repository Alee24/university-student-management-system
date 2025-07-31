const pool = require('../config/db');

async function enrollStudent(studentId, courseId) {
  const [result] = await pool.query(
    'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
    [studentId, courseId]
  );
  return { id: result.insertId, student_id: studentId, course_id: courseId };
}

async function removeEnrollment(studentId, courseId) {
  const [result] = await pool.query(
    'DELETE FROM enrollments WHERE student_id = ? AND course_id = ?',
    [studentId, courseId]
  );
  return result;
}

async function getEnrollmentsByStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT e.*, c.code, c.title
     FROM enrollments e
     JOIN courses c ON e.course_id = c.id
     WHERE e.student_id = ?`,
    [studentId]
  );
  return rows;
}

async function getStudentsByCourse(courseId) {
  const [rows] = await pool.query(
    `SELECT e.*, u.full_name, u.email
     FROM enrollments e
     JOIN users u ON e.student_id = u.id
     WHERE e.course_id = ?`,
    [courseId]
  );
  return rows;
}

module.exports = {
  enrollStudent,
  removeEnrollment,
  getEnrollmentsByStudent,
  getStudentsByCourse,
};
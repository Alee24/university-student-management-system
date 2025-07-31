/**
 * Placeholder functions for generating reports.  In a real production
 * application you might implement PDF or Excel generation here using
 * libraries such as pdfkit or exceljs.  Currently these functions
 * simply return data from the database for demonstration purposes.
 */
const pool = require('../config/db');

async function getStudentPerformanceSummary(studentId) {
  const [rows] = await pool.query(
    `SELECT u.id, u.full_name, c.title, g.grade_value
     FROM users u
     JOIN grades g ON u.id = g.student_id
     JOIN courses c ON g.course_id = c.id
     WHERE u.id = ?`,
    [studentId]
  );
  return rows;
}

async function getCoursePerformanceSummary(courseId) {
  const [rows] = await pool.query(
    `SELECT c.id AS course_id, c.title AS course_title, u.full_name, g.grade_value
     FROM courses c
     JOIN grades g ON c.id = g.course_id
     JOIN users u ON g.student_id = u.id
     WHERE c.id = ?`,
    [courseId]
  );
  return rows;
}

module.exports = {
  getStudentPerformanceSummary,
  getCoursePerformanceSummary,
};
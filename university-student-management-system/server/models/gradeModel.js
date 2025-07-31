const pool = require('../config/db');

async function addGrade(studentId, courseId, gradeValue) {
  const [result] = await pool.query(
    'INSERT INTO grades (student_id, course_id, grade_value) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE grade_value = VALUES(grade_value)',
    [studentId, courseId, gradeValue]
  );
  return result;
}

async function deleteGrade(studentId, courseId) {
  const [result] = await pool.query(
    'DELETE FROM grades WHERE student_id = ? AND course_id = ?',
    [studentId, courseId]
  );
  return result;
}

async function getGradesByStudent(studentId) {
  const [rows] = await pool.query(
    `SELECT g.*, c.code, c.title
     FROM grades g
     JOIN courses c ON g.course_id = c.id
     WHERE g.student_id = ?`,
    [studentId]
  );
  return rows;
}

async function getGradesByCourse(courseId) {
  const [rows] = await pool.query(
    `SELECT g.*, u.full_name, u.email
     FROM grades g
     JOIN users u ON g.student_id = u.id
     WHERE g.course_id = ?`,
    [courseId]
  );
  return rows;
}

module.exports = {
  addGrade,
  deleteGrade,
  getGradesByStudent,
  getGradesByCourse,
};
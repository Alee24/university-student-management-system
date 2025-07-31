const pool = require('../config/db');

async function createCourse(course) {
  const { code, title, description, department_id } = course;
  const [result] = await pool.query(
    'INSERT INTO courses (code, title, description, department_id) VALUES (?, ?, ?, ?)',
    [code, title, description, department_id || null]
  );
  return { id: result.insertId, ...course };
}

async function getAllCourses({ departmentId } = {}) {
  let query = 'SELECT c.*, d.name AS department_name FROM courses c LEFT JOIN departments d ON c.department_id = d.id';
  const params = [];
  if (departmentId) {
    query += ' WHERE c.department_id = ?';
    params.push(departmentId);
  }
  query += ' ORDER BY c.id DESC';
  const [rows] = await pool.query(query, params);
  return rows;
}

async function getCourseById(id) {
  const [rows] = await pool.query('SELECT * FROM courses WHERE id = ?', [id]);
  return rows[0];
}

async function updateCourse(id, data) {
  const fields = [];
  const params = [];
  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    params.push(value);
  });
  params.push(id);
  const query = `UPDATE courses SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, params);
  return result;
}

async function deleteCourse(id) {
  const [result] = await pool.query('DELETE FROM courses WHERE id = ?', [id]);
  return result;
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};
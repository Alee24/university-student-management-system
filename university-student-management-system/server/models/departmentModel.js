const pool = require('../config/db');

async function createDepartment({ name, description }) {
  const [result] = await pool.query(
    'INSERT INTO departments (name, description) VALUES (?, ?)',
    [name, description]
  );
  return { id: result.insertId, name, description };
}

async function getAllDepartments() {
  const [rows] = await pool.query('SELECT * FROM departments ORDER BY id DESC');
  return rows;
}

async function getDepartmentById(id) {
  const [rows] = await pool.query('SELECT * FROM departments WHERE id = ?', [id]);
  return rows[0];
}

async function updateDepartment(id, data) {
  const fields = [];
  const params = [];
  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    params.push(value);
  });
  params.push(id);
  const query = `UPDATE departments SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, params);
  return result;
}

async function deleteDepartment(id) {
  const [result] = await pool.query('DELETE FROM departments WHERE id = ?', [id]);
  return result;
}

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
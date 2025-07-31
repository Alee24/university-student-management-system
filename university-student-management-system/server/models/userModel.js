const pool = require('../config/db');

/**
 * Creates a new user record.
 * @param {Object} user Data for the new user.
 * @returns {Promise<Object>} The created user with the inserted ID.
 */
async function createUser(user) {
  const { username, password, role, full_name, email, department_id } = user;
  const [result] = await pool.query(
    'INSERT INTO users (username, password, role, full_name, email, department_id) VALUES (?, ?, ?, ?, ?, ?)',
    [username, password, role, full_name, email, department_id || null]
  );
  return { id: result.insertId, ...user };
}

/**
 * Retrieves a user by username.
 * @param {string} username
 */
async function findByUsername(username) {
  const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
  return rows[0];
}

/**
 * Retrieves a user by ID.
 * @param {number} id
 */
async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
}

/**
 * Returns a paginated list of students with optional search and department filtering.
 *
 * @param {Object} filters Filter options { search, departmentId, page, limit }
 */
async function getStudents({ search = '', departmentId, page = 1, limit = 10 }) {
  const offset = (page - 1) * limit;
  let query = 'SELECT u.*, d.name AS department_name FROM users u LEFT JOIN departments d ON u.department_id = d.id WHERE u.role = "student"';
  const params = [];
  if (search) {
    query += ' AND (u.full_name LIKE ? OR u.username LIKE ? OR u.email LIKE ?)';
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (departmentId) {
    query += ' AND u.department_id = ?';
    params.push(departmentId);
  }
  query += ' ORDER BY u.id DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit, 10), parseInt(offset, 10));
  const [rows] = await pool.query(query, params);
  return rows;
}

/**
 * Updates a user by ID.
 * @param {number} id
 * @param {Object} data Fields to update
 */
async function updateUser(id, data) {
  const fields = [];
  const params = [];
  Object.entries(data).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    params.push(value);
  });
  params.push(id);
  const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, params);
  return result;
}

/**
 * Deletes a user by ID.
 * @param {number} id
 */
async function deleteUser(id) {
  const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
  return result;
}

module.exports = {
  createUser,
  findByUsername,
  findById,
  getStudents,
  updateUser,
  deleteUser,
};
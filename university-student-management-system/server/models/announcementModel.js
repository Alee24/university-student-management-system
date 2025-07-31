const pool = require('../config/db');

async function createAnnouncement({ title, message, posted_by }) {
  const [result] = await pool.query(
    'INSERT INTO announcements (title, message, posted_by) VALUES (?, ?, ?)',
    [title, message, posted_by || null]
  );
  return { id: result.insertId, title, message, posted_by };
}

async function getAnnouncements() {
  const [rows] = await pool.query(
    `SELECT a.*, u.full_name AS posted_by_name
     FROM announcements a
     LEFT JOIN users u ON a.posted_by = u.id
     ORDER BY a.created_at DESC`
  );
  return rows;
}

async function deleteAnnouncement(id) {
  const [result] = await pool.query('DELETE FROM announcements WHERE id = ?', [id]);
  return result;
}

module.exports = {
  createAnnouncement,
  getAnnouncements,
  deleteAnnouncement,
};
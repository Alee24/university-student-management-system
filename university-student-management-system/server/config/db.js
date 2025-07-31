const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

// Create a MySQL connection pool.  Using a pool allows us to reuse connections
// and avoid creating a new connection for every query.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
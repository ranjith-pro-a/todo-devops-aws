const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

async function ping() {
  const conn = await pool.getConnection();
  await conn.ping();
  conn.release();
}

async function getTasks() {
  const [rows] = await pool.query('SELECT * FROM tasks ORDER BY created_at DESC');
  return rows;
}

async function createTask(title) {
  const [res] = await pool.query('INSERT INTO tasks (title) VALUES (?)', [title]);
  return res.insertId;
}

async function updateTask(id, { title, completed }) {
  await pool.query(
    'UPDATE tasks SET title = ?, completed = ? WHERE id = ?',
    [title, completed ? 1 : 0, id]
  );
}

async function deleteTask(id) {
  await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
}

module.exports = { ping, getTasks, createTask, updateTask, deleteTask };
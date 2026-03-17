const { pool } = require('./db/db');

async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT DEFAULT 'user'
      );
    `);
    console.log("DB initialized");
  } catch (err) {
    console.error("DB init error:", err.message);
  }
}

initDB();
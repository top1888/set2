const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function initDB() {
  try {
    console.log("Initializing DB...");
    const sql = fs.readFileSync('./init.sql').toString();
    await pool.query(sql);
    console.log("DB initialized ✅");
  } catch (err) {
    console.error("DB init error:", err);
  }
}

module.exports = { pool, initDB };
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const { pool } = require('./db/db');

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use('/api/auth', authRoutes);

// root
app.get('/', (req, res) => {
  res.send("AUTH SERVICE OK");
});

// health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'auth-service' });
});
async function createDefaultAdmin() {
  try {
    const email = 'admin@test.com';

    // เช็คว่ามี admin อยู่แล้วไหม
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      console.log('⚠️ No admin found, creating one...');

      await pool.query(
        `INSERT INTO users (username, email, password_hash, role)
         VALUES ($1, $2, $3, $4)`,
        [
          'admin',
          email,
          '$2b$10$RPH72Wfh/JQ.kj/8HvbObeZnPDQHGrpm5ZObTn1GZmlJgGWJOfEq2',
          'admin'
        ]
      );

      console.log('✅ Default admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
  }
}

// ✅ init DB (สำคัญ)
async function initDB() {
  try {
    console.log("Initializing DB...");

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        email TEXT UNIQUE,
        password_hash TEXT,
        role TEXT DEFAULT 'member',
        last_login TIMESTAMP
      );
    `);

    console.log("DB initialized ✅");
  } catch (err) {
    console.error("DB init error ❌:", err.message);
  }
}

initDB().catch(console.error);

const PORT = process.env.PORT || 3001;

app.listen(PORT, async () => {
  console.log(`Auth Service running on port ${PORT}`);
   await createDefaultAdmin();
});
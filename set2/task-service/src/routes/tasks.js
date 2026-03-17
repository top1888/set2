const express = require('express');
const { pool } = require('../db/db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 🔐 ใช้ auth ทุก route
router.use(authMiddleware);


// =====================
// ✅ GET ALL TASKS
// =====================
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id || req.user.sub;
    let result;

    if (req.user.role === 'admin') {
      result = await pool.query(
        'SELECT * FROM tasks ORDER BY id DESC'
      );
    } else {
      result = await pool.query(
        'SELECT * FROM tasks WHERE user_id = $1 ORDER BY id DESC',
        [userId]
      );
    }

    res.json({
      tasks: result.rows,
      count: result.rowCount
    });

  } catch (err) {
    console.error('🔥 DB Error (GET):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


// =====================
// ✅ CREATE TASK
// =====================
router.post('/', async (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'title is required' });
  }

  const userId = req.user.id || req.user.sub;

  try {
    const result = await pool.query(
      `INSERT INTO tasks (user_id, title, completed)
       VALUES ($1, $2, $3) RETURNING *`,
      [userId, title, false]
    );

    res.status(201).json({
      message: 'task created',
      task: result.rows[0]
    });

  } catch (err) {
    console.error('🔥 DB Error (POST):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


// =====================
// ✅ UPDATE TASK
// =====================
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  const userId = req.user.id || req.user.sub;

  try {
    const result = await pool.query(
      `UPDATE tasks 
       SET title = COALESCE($1, title),
           completed = COALESCE($2, completed)
       WHERE id = $3 AND user_id = $4
       RETURNING *`,
      [title, completed, id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'task updated',
      task: result.rows[0]
    });

  } catch (err) {
    console.error('🔥 DB Error (PUT):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


// =====================
// ✅ DELETE TASK
// =====================
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id || req.user.sub;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
      message: 'task deleted',
      task: result.rows[0]
    });

  } catch (err) {
    console.error('🔥 DB Error (DELETE):', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});


module.exports = router;
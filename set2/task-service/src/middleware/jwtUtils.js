const jwt = require('jsonwebtoken');

exports.verifyToken = (token) => {
  try {
    if (!process.env.JWT_SECRET) {
      console.error("❌ JWT_SECRET is undefined!");
    }

    return jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
  } catch (err) {
    console.error("🔥 JWT Verify Failed:", err.message);
    throw err;
  }
};
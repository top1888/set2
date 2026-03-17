const jwt = require('jsonwebtoken');

exports.verifyToken = (token) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is NOT set!");
    throw new Error("JWT_SECRET not configured");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error("⏰ Token expired");
    } else if (err.name === 'JsonWebTokenError') {
      console.error("❌ Invalid token");
    } else {
      console.error("🔥 JWT Error:", err.message);
    }
    throw err;
  }
};
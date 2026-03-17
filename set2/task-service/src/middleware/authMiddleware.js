const { verifyToken } = require('../utils/jwtUtils');

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded; // 🔥 สำคัญมาก
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
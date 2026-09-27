const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'research_os_super_secret_jwt_key_2026';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1] || authHeader;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Session expired or invalid token. Please sign in.' });
  }
}

module.exports = { authMiddleware, JWT_SECRET };

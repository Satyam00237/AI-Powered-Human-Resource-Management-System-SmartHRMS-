import jwt from 'jsonwebtoken';
import config from '../config/env.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expecting: Bearer <token>

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Authentication token missing.' });
  }

  if (!config.JWT_SECRET) {
    return res.status(503).json({ error: 'Server misconfigured: JWT_SECRET is not set.' });
  }

  try {
    const verified = jwt.verify(token, config.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Access denied. Invalid or expired token.' });
  }
};

export default authenticateToken;

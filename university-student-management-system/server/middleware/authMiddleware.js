const jwt = require('jsonwebtoken');

/**
 * Authentication middleware.  Checks for a bearer token in the
 * `Authorization` header and verifies it using the configured JWT secret.
 * If valid, attaches the decoded user payload to `req.user` and calls `next()`.
 * Otherwise responds with 401/403 errors.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticate;
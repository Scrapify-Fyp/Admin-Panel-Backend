const jwt = require('jsonwebtoken');

// Middleware to validate JWT token
const authMiddleware = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, 'jwtSecret');

    // Attach user information to request object
    req.user = decoded.user;

    // Continue to next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

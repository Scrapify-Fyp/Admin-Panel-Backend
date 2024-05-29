const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from cookies
  const token = req.cookies.token;

  // Check if token is missing
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRETKEY);

    // Attach user or admin information to request object based on your token payload
    req.admin = decoded.admin;

    // Continue to next middleware or route handler
    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = authMiddleware;

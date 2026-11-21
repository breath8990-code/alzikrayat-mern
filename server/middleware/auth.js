const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protects the write routes (upload, delete, comment).
// The client must send the header "Authorization: Bearer <token>".
// The token is verified with the secret from .env, then the user is loaded from the database.
const protect = async (req, res, next) => {
  try {
    const [scheme, token] = (req.get('Authorization') || '').split(' ');
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ message: 'Please log in first' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Your session has expired, please log in again' });
    }
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token, please log in again' });
    }
    next(err);
  }
};

module.exports = { protect };

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const saltRounds = 10;

// Creates a signed token. The payload only holds the user id, never the password.
const signToken = (user) =>
  jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, location, description, occupation } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = await User.create({
      firstName, lastName, email, password: hashedPassword, location, description, occupation,
    });

    // send the token with the public profile (toJSON removes the password hash)
    res.status(201).json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    // Same message for both cases so the API does not reveal which emails exist
    const matches = user && (await bcrypt.compare(password, user.password));
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({ token: signToken(user), user });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me (needs a valid token)
// lets the client check that its stored token still works
exports.getMe = (req, res) => {
  res.json(req.user);
};

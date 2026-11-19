const bcrypt = require('bcrypt');
const User = require('../models/User');

const saltRounds = 10;

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

    res.status(201).json(user); // toJSON removes the password hash
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

    res.json(user);
  } catch (err) {
    next(err);
  }
};

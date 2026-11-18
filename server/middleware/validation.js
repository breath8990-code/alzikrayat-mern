const fs = require('fs');
const Joi = require('joi');
const mongoose = require('mongoose');

const optionalText = (max) => Joi.string().trim().max(max).allow('');

const registerSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).max(72).required(), // bcrypt only uses the first 72 bytes
  location: optionalText(100),
  description: optionalText(500),
  occupation: optionalText(100),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
});

const photoSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: optionalText(1000),
});

const commentSchema = Joi.object({
  comment: Joi.string().trim().max(1000).required(),
});

// Builds a middleware that validates req.body against a Joi schema
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    // If a file was already saved by multer, remove it
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      message: 'Validation failed',
      details: error.details.map((d) => d.message),
    });
  }
  req.body = value;
  next();
};

// Rejects malformed ids before they reach the database
const validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  next();
};

module.exports = { validate, validateObjectId, registerSchema, loginSchema, photoSchema, commentSchema };

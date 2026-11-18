const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: [true, 'First name is required'], trim: true, maxlength: 50 },
  lastName: { type: String, required: [true, 'Last name is required'], trim: true, maxlength: 50 },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
  },
  // Always stores a bcrypt hash, never plain text
  password: { type: String, required: [true, 'Password is required'] },
  location: { type: String, trim: true, default: '' },
  description: { type: String, trim: true, default: '' },
  occupation: { type: String, trim: true, default: '' },
});

// Never send the password hash to the client
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);

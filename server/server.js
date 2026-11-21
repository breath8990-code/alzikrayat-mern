// Express app entry point
require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 5000;

// the server cannot run without the database address and the JWT secret
if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.error('MONGODB_URI or JWT_SECRET is missing. Copy .env.example to .env and set them.');
  process.exit(1);
}

// Global middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

// Uploaded images are served as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// REST API routes
app.get('/api', (req, res) => res.json({ message: 'Alzikrayat API is running' }));
app.use(authRoutes);
app.use(photoRoutes);
app.use(commentRoutes);

// 404 and error handling (must come last)
app.use(notFound);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });

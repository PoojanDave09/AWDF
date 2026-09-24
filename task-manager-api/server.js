// ============================================================
// Practical 4: Full-Stack Task Manager API
// Node.js + Express + MongoDB (Mongoose)
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = 5000;

// ============================================================
// MongoDB Connection
// ============================================================
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB - taskmanager database'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Make sure MongoDB is running on your machine.');
    process.exit(1);
  });

// ============================================================
// Built-in Middleware
// ============================================================
app.use(cors());
app.use(express.json());

// Serve static frontend files from /public
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Custom Request Logging Middleware (Applied Globally)
// ============================================================
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// ============================================================
// Content-Type Validation Middleware
// ============================================================
app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') &&
      req.url.startsWith('/api') &&
      !req.is('application/json')) {
    return res.status(415).json({
      success: false,
      error: 'Unsupported Media Type',
      message: 'Content-Type must be application/json for POST and PUT requests'
    });
  }
  next();
});

// ============================================================
// API Routes
// ============================================================
app.use('/api/tasks', taskRoutes);

// ============================================================
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  next();
});

// ============================================================
// 404 Handler for Undefined API Routes
// ============================================================
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API Route Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: [
      'GET    /api/tasks        - Get all tasks',
      'GET    /api/tasks/:id    - Get a single task',
      'POST   /api/tasks        - Create a new task',
      'PUT    /api/tasks/:id    - Update a task',
      'DELETE /api/tasks/:id    - Delete a task'
    ]
  });
});

// ============================================================
// Global Error Handling Middleware (MUST be last)
// ============================================================
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler ---');
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);

  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong'
      : err.message
  });
});

// ============================================================
// Start Server
// ============================================================
app.listen(PORT, () => {
  console.log(`\n===========================================`);
  console.log(`  Task Manager — Full Stack App`);
  console.log(`  Server:   http://localhost:${PORT}`);
  console.log(`  Frontend: http://localhost:${PORT}`);
  console.log(`  API Base: http://localhost:${PORT}/api/tasks`);
  console.log(`===========================================\n`);
});

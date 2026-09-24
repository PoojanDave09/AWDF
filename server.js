// ============================================================
// server.js — Student Portfolio Full-Stack Backend
// Node.js + Express + MongoDB (Mongoose) + JWT Auth
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./routes/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MongoDB Connection
// ============================================================
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB - taskmanager database'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ============================================================
// Middleware
// ============================================================
app.use(cors());
app.use(express.json());

// Serve built React app
app.use(express.static(path.join(__dirname, 'dist')));

// Request logger
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

// Content-Type validation for API POST/PUT
app.use((req, res, next) => {
  if ((req.method === 'POST' || req.method === 'PUT') &&
      req.url.startsWith('/api') &&
      !req.is('application/json')) {
    return res.status(415).json({
      success: false,
      error: 'Unsupported Media Type',
      message: 'Content-Type must be application/json'
    });
  }
  next();
});

// ============================================================
// API Routes
// ============================================================

// Public: auth (register/login)
app.use('/api/auth', authRoutes);

// Protected: tasks require a valid JWT
app.use('/api/tasks', authMiddleware, taskRoutes);

// ============================================================
// Serve React for all non-API routes (SPA catch-all)
// ============================================================
app.use((req, res, next) => {
  if (!req.url.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
  next();
});

// ============================================================
// 404 Handler for undefined API routes
// ============================================================
app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'API Route Not Found',
    message: `Cannot ${req.method} ${req.url}`,
    availableEndpoints: [
      'POST   /api/auth/register  - Register a new user',
      'POST   /api/auth/login     - Login and get token',
      'GET    /api/auth/me        - Get current user (protected)',
      'GET    /api/tasks          - Get all tasks (protected)',
      'POST   /api/tasks          - Create a task (protected)',
      'PUT    /api/tasks/:id      - Update a task (protected)',
      'DELETE /api/tasks/:id      - Delete a task (protected)',
    ]
  });
});

// ============================================================
// Global Error Handler
// ============================================================
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler ---');
  console.error(`Error: ${err.message}`);
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
  console.log(`  Student Portfolio — Full Stack App`);
  console.log(`  Server:   http://localhost:${PORT}`);
  console.log(`  API Base: http://localhost:${PORT}/api`);
  console.log(`===========================================\n`);
});

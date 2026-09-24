// ============================================================
// Integrated Server for Student Portfolio + Task Manager API
// Express + MongoDB (Mongoose)
// Serves React build (dist) and provides /api/tasks endpoints
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ------------------------------------------------------------
// MongoDB Connection
// ------------------------------------------------------------
20: const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/taskmanager';
21: 
22: let useMock = false; // true => run without MongoDB
23: 
24: // Try to connect to MongoDB, but tolerate failure for a no‑DB mode
25: mongoose.connect(MONGO_URI)
26:   .then(() => console.log('✅ Connected to MongoDB - taskmanager database'))
27:   .catch(err => {
28:     console.warn('⚠️ MongoDB connection failed – switching to in‑memory store');
29:     console.warn('   Error:', err.message);
30:     useMock = true;
31:   });

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB - taskmanager database'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('   Ensure MongoDB is running or provide a valid connection string.');
    process.exit(1);
  });

// ------------------------------------------------------------
// Middleware
// ------------------------------------------------------------
app.use(cors());
app.use(express.json());

// Request logging (global)
app.use((req, res, next) => {
  const ts = new Date().toISOString();
  console.log(`[${ts}] ${req.method} ${req.url}`);
  next();
});

// Content‑Type validation for API routes
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

// ------------------------------------------------------------
// API Routes
// ------------------------------------------------------------
app.use('/api/tasks', taskRoutes);

// ------------------------------------------------------------
// Serve React Frontend (built files in /dist)
// ------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback – any non‑API route serves index.html
app.get('*', (req, res) => {
  if (!req.url.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  } else {
    res.status(404).json({
      success: false,
      error: 'API route not found',
      message: `Cannot ${req.method} ${req.url}`
    });
  }
});

// ------------------------------------------------------------
// Global Error Handler (must be last)
// ------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error('--- Global Error Handler ---');
  console.error(`Error: ${err.message}`);
  console.error(`Stack: ${err.stack}`);
  res.status(err.status || 500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// ------------------------------------------------------------
// Start Server
// ------------------------------------------------------------
app.listen(PORT, () => {
  console.log('\n===========================================');
  console.log('  Student Portfolio + Task Manager');
  console.log(`  Server listening on http://localhost:${PORT}`);
  console.log('  Frontend (React) served from /dist');
  console.log('  API base: /api/tasks');
  console.log('===========================================\n');
});

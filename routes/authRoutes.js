// ============================================================
// routes/authRoutes.js — Register, Login, /me
// ============================================================
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('./authMiddleware');

// Validation middleware for auth inputs
const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Email and password are required'
    });
  }
  next();
};

// ============================================================
// POST /api/auth/register
// ============================================================
router.post('/register', validateAuthInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'An account with this email already exists'
      });
    }

    const user = await User.create({ email, password });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: messages.join(', ')
      });
    }
    next(err);
  }
});

// ============================================================
// POST /api/auth/login
// ============================================================
router.post('/login', validateAuthInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, email: user.email }
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /api/auth/me — Returns the currently logged-in user
// ============================================================
router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

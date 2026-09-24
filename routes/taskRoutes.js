// ============================================================
// Task Routes — Express Router with CRUD endpoints
// ============================================================

const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// ============================================================
// Route-Specific Middleware: Validate MongoDB ObjectId
// ============================================================
const validateObjectId = (req, res, next) => {
  const mongoose = require('mongoose');
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid Task ID',
      message: 'The provided ID is not a valid MongoDB ObjectId'
    });
  }
  next();
};

// ============================================================
// GET /api/tasks — Retrieve all tasks
// ============================================================
router.get('/', async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// GET /api/tasks/:id — Retrieve a single task
// ============================================================
router.get('/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: `No task found with ID ${req.params.id}`
      });
    }
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (err) {
    next(err);
  }
});

// ============================================================
// POST /api/tasks — Create a new task
// ============================================================
router.post('/', async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        message: 'Title and description are required fields'
      });
    }

    const task = await Task.create({ title, description, priority });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (err) {
    // Handle Mongoose validation errors
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
// PUT /api/tasks/:id — Update an existing task
// ============================================================
router.put('/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: `No task found with ID ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: task
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
// DELETE /api/tasks/:id — Delete a task
// ============================================================
router.delete('/:id', validateObjectId, async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found',
        message: `No task found with ID ${req.params.id}`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: task
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

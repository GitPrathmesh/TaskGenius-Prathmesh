const express = require('express');
const router = express.Router();
const Task = require('../models/Task'); 

// GET 
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }); 
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST 
router.post('/', async (req, res) => {
  const { title } = req.body; 

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  const newTask = new Task({
    title: title
  });

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT 
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body; 

    const taskToUpdate = await Task.findById(id);
    if (!taskToUpdate) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update 
    if (title !== undefined) {
      taskToUpdate.title = title;
    }
    if (completed !== undefined) {
      taskToUpdate.completed = completed;
    }

    const updatedTask = await taskToUpdate.save();
    res.json(updatedTask);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

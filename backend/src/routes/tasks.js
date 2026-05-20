const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const tasks = await db.getTasks();
    res.json(tasks);
  } catch (err) {
    req.logError('GET /api/tasks failed', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'title is required' });
    const id = await db.createTask(title);
    res.status(201).json({ id, title, completed: false });
  } catch (err) {
    req.logError('POST /api/tasks failed', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, completed } = req.body;
    const { id } = req.params;
    await db.updateTask(id, { title, completed });
    res.json({ id, title, completed });
  } catch (err) {
    req.logError('PUT /api/tasks/:id failed', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteTask(id);
    res.status(204).send();
  } catch (err) {
    req.logError('DELETE /api/tasks/:id failed', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
const express = require('express');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const db = require('./db');
const tasksRouter = require('./routes/tasks');

const app = express();
const port = process.env.PORT || 3000;

const logDir = '/var/log/todo-app';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}
const accessLogStream = fs.createWriteStream(
  path.join(logDir, 'access.log'), { flags: 'a' }
);

// Request logging
app.use(morgan('combined', { stream: accessLogStream }));
app.use(express.json());

// Attach a helper for structured app logs
app.use((req, res, next) => {
  req.logError = (msg, err) => {
    const logLine = JSON.stringify({
      level: 'error',
      msg,
      error: err.message,
      stack: err.stack,
      time: new Date().toISOString()
    });
    fs.appendFileSync(path.join(logDir, 'app.log'), logLine + '\n');
  };
  next();
});

// Health check (checks DB)
app.get('/health', async (req, res) => {
  try {
    await db.ping();
    res.json({ status: 'ok', db: 'up' });
  } catch (err) {
    req.logError('Health check failed', err);
    res.status(500).json({ status: 'error', db: 'down' });
  }
});

// API routes
app.use('/api/tasks', tasksRouter);

// Serve frontend
app.use(express.static(path.join(__dirname, '../../frontend')));

app.listen(port, () => {
  console.log(`Todo app listening on port ${port}`);
});
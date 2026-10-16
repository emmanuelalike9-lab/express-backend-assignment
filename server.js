/**
 * Simple Express server with:
 * - In-memory students CRUD
 * - SSE endpoint that streams server time every 2 seconds
 *
 * Usage:
 *   npm install express dotenv cors
 *   node server.js
 *
 * Open http://localhost:3000 to see the SSE client
 */
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// In-memory students array (kept inside this file)
let nextId = 1;
const students = [
  { id: String(nextId++), name: 'Alice', email: 'alice@example.com', age: 21, course: 'html' },
  { id: String(nextId++), name: 'Bob', email: 'bob@example.com', age: 23, course: 'css' },
];

// Helper functions
function findById(id) {
  return students.find(s => s.id === id);
}
function findByEmail(email) {
  return students.find(s => s.email.toLowerCase() === email.toLowerCase());
}

// CRUD endpoints

// CREATE
app.post('/students', (req, res) => {
  const { name, email, age, course } = req.body;
  if (!name || !email || !age || !course) {
    return res.status(400).json({ error: 'name, email, age and course are required' });
  }
  if (findByEmail(email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }
  const newStudent = {
    id: String(nextId++),
    name,
    email,
    age,
    course,
  };
  students.push(newStudent);
  return res.status(201).json(newStudent);
});

// READ ALL
app.get('/students', (req, res) => {
  return res.status(200).json(students);
});

// READ ONE by id
app.get('/students/:id', (req, res) => {
  const student = findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  return res.status(200).json(student);
});

// READ ONE by email
app.get('/students/email/:email', (req, res) => {
  const student = findByEmail(req.params.email);
  if (!student) return res.status(404).json({ error: 'Student not found' });
  return res.status(200).json(student);
});

// READ ALL in a category (course)
app.get('/students/course/:course', (req, res) => {
  const course = req.params.course.toLowerCase();
  const found = students.filter(s => s.course.toLowerCase() === course);
  return res.status(200).json(found);
});

// UPDATE by id
app.put('/students/:id', (req, res) => {
  const student = findById(req.params.id);
  if (!student) return res.status(404).json({ error: 'Student not found' });

  const { name, email, age, course } = req.body;

  if (email && email !== student.email && findByEmail(email)) {
    return res.status(409).json({ error: 'Email already in use by another student' });
  }

  // Update fields if provided
  if (name !== undefined) student.name = name;
  if (email !== undefined) student.email = email;
  if (age !== undefined) student.age = age;
  if (course !== undefined) student.course = course;

  return res.status(200).json(student);
});

// DELETE by id
app.delete('/students/:id', (req, res) => {
  const idx = students.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Student not found' });
  const removed = students.splice(idx, 1)[0];
  return res.status(200).json({ message: 'Deleted', student: removed });
});

// SSE endpoint - sends server time every 2 seconds
app.get('/sse/time', (req, res) => {
  // Set required headers for SSE
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.flushHeaders();

  // Send an initial event
  const sendTime = () => {
    const now = new Date().toISOString();
    // SSE format: data: <payload>\n\n
    res.write(`data: ${now}\n\n`);
  };

  sendTime();
  const timer = setInterval(sendTime, 2000);

  // When client closes connection, stop the interval
  req.on('close', () => {
    clearInterval(timer);
  });
});

// Serve index.html for a quick client demo
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handler (basic)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server (server.js is the entry point)
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`SSE time endpoint available at http://localhost:${PORT}/sse/time`);
  console.log(`Open http://localhost:${PORT} to view SSE client`);
});

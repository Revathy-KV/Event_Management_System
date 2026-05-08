const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // allows HTML file to talk to backend
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database setup
const db = new Database('feedback.db');

// Create table
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    event TEXT,
    message TEXT
  )
`);

console.log('Database ready!');

// Welcome route
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Event Feedback Backend!</h1>');
});

// ✅ Receive feedback and save to database
// Now returns JSON instead of redirect
app.post('/feedback', (req, res) => {
  const { name, event, message } = req.body;

  const insert = db.prepare(`
    INSERT INTO feedback (name, event, message) 
    VALUES (?, ?, ?)
  `);

  insert.run(name, event, message);

  // Send JSON response instead of redirect
  res.json({ success: true, message: 'Feedback saved!' });
});

// ✅ Return feedback as JSON (for frontend to read)
app.get('/all-feedback', (req, res) => {
  const allFeedback = db.prepare('SELECT * FROM feedback').all();
  res.json(allFeedback); // sends data as JSON
});

// Start server
app.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
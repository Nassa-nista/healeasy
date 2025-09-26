const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../db');
const { sign } = require('../utils/jwt');

const router = express.Router();

// Register
router.post('/register', (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return res.status(400).json({ error: 'email, name, password required' });

  const password_hash = bcrypt.hashSync(password, 10);
  try {
    const info = db
      .prepare('INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)')
      .run(email, name, password_hash);
    const token = sign({ id: info.lastInsertRowid, email });
    res.status(201).json({ token });
  } catch (e) {
    if (String(e).includes('UNIQUE')) {
      return res.status(409).json({ error: 'Email already used' });
    }
    return res.status(500).json({ error: 'Cannot register' });
  }
});

// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  const token = sign({ id: user.id, email: user.email });
  res.json({ token });
});

module.exports = router;

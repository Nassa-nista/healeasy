const express = require('express');
const { db } = require('../db');
const { auth } = require('../middleware');

const router = express.Router();

// All these need login
router.use(auth);

// List my medications
router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM medications WHERE user_id = ?')
    .all(req.user.id);
  res.json(rows);
});

// Create
router.post('/', (req, res) => {
  const { name, dosage, schedule, start_date, end_date, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const info = db
    .prepare(
      `INSERT INTO medications (user_id, name, dosage, schedule, start_date, end_date, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, name, dosage || '', schedule || '', start_date || '', end_date || '', notes || '');
  const created = db.prepare('SELECT * FROM medications WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(created);
});

// Update
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const old = db.prepare('SELECT * FROM medications WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!old) return res.status(404).json({ error: 'not found' });
  const { name, dosage, schedule, start_date, end_date, notes } = req.body;
  db.prepare(
    `UPDATE medications SET
      name = COALESCE(?, name),
      dosage = COALESCE(?, dosage),
      schedule = COALESCE(?, schedule),
      start_date = COALESCE(?, start_date),
      end_date = COALESCE(?, end_date),
      notes = COALESCE(?, notes)
     WHERE id = ? AND user_id = ?`
  ).run(name, dosage, schedule, start_date, end_date, notes, id, req.user.id);

  const updated = db.prepare('SELECT * FROM medications WHERE id = ?').get(id);
  res.json(updated);
});

// Delete
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM medications WHERE id = ? AND user_id = ?').run(id, req.user.id);
  if (info.changes === 0) return res.status(404).json({ error: 'not found' });
  res.json({ ok: true });
});

module.exports = router;

const Database = require('better-sqlite3');

const DB_PATH = process.env.HEALEASY_DB || 'healeasy.db';
const db = new Database(DB_PATH);

// Create tables if they don't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS medications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    dosage TEXT,
    schedule TEXT,
    start_date TEXT,
    end_date TEXT,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

module.exports = { db };

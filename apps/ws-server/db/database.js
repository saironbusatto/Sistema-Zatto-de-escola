const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'plataforma.db');
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

let _db = null;

function getDb() {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  runMigrations(_db);
  return _db;
}

function runMigrations(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      arquivo     TEXT NOT NULL UNIQUE,
      aplicado_em TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const applied = new Set(db.prepare('SELECT arquivo FROM migrations').pluck().all());
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    db.exec(sql);
    db.prepare('INSERT INTO migrations (arquivo) VALUES (?)').run(file);
    console.log(`[db] migration: ${file}`);
  }
}

module.exports = { getDb };

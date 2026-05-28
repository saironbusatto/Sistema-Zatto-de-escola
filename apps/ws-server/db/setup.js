// Roda migrations + seed. Idempotente — seguro rodar múltiplas vezes.
// Uso: node db/setup.js
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { getDb } = require('./database.js');

getDb(); // dispara migrations
console.log('[setup] Migrations aplicadas.');

// Seed apenas se módulo 0 ainda não existe
const db = getDb();
const existe = db.prepare("SELECT id FROM modulos WHERE slug = 'modulo-0'").get();
if (existe) {
  console.log('[setup] Seed ignorado — Módulo 0 já existe.');
} else {
  require('./seed.js');
}

process.exit(0);

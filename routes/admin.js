const express = require('express');
const bcrypt  = require('bcrypt');
const { getDb } = require('../db/database.js');
const { requireAdminApi } = require('../middleware/adminAuth.js');

const router = express.Router();

// ── Rate limiting em memória para login (sem dependência extra) ──────────
// cc-skill-security-review: limite brute-force no endpoint de autenticação
const loginAttempts = new Map();

function loginRateLimit(req, res, next) {
  const ip  = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const TTL = 15 * 60 * 1000; // 15 minutos
  const MAX = 10;

  let entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + TTL };
  }
  entry.count++;
  loginAttempts.set(ip, entry);

  if (entry.count > MAX) {
    return res.status(429).json({ erro: 'Muitas tentativas. Aguarde 15 minutos.' });
  }
  next();
}

// Limpa entradas expiradas a cada 30 min (evita leak de memória)
setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of loginAttempts) {
    if (now > e.resetAt) loginAttempts.delete(ip);
  }
}, 30 * 60 * 1000);

// ── Rotas públicas (sem requireAdmin) ────────────────────────────────────

// POST /api/admin/login
router.post('/login', loginRateLimit, async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ erro: 'Credenciais inválidas' });
  }

  const db   = getDb();
  const user = db.prepare(
    'SELECT id, username, nome, password_hash FROM admin_users WHERE username = ?'
  ).get(String(username).slice(0, 80));

  // Compara sempre (mesmo se user não existe) para evitar timing attack
  const hash      = user?.password_hash || '$2b$12$invalido.hash.para.comparacao.segura';
  const match     = await bcrypt.compare(String(password).slice(0, 200), hash);

  if (!user || !match) {
    // Mensagem genérica — não revela se username ou senha está errada
    return res.status(401).json({ erro: 'Credenciais inválidas' });
  }

  // Regenera sessão antes de gravar dados (session fixation prevention)
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ erro: 'Erro interno' });
    req.session.adminId   = user.id;
    req.session.adminUser = user.username;

    db.prepare("UPDATE admin_users SET ultimo_login = datetime('now') WHERE id = ?").run(user.id);

    // Limpa contador de tentativas do IP após login bem-sucedido
    loginAttempts.delete(req.ip || req.socket.remoteAddress);

    res.json({ ok: true, nome: user.nome || user.username });
  });
});

// POST /api/admin/logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ ok: true });
  });
});

// ── Rotas protegidas (requireAdmin aplicado abaixo) ──────────────────────

// GET /api/admin/me
router.get('/me', requireAdminApi, (req, res) => {
  res.json({ username: req.session.adminUser });
});

module.exports = router;

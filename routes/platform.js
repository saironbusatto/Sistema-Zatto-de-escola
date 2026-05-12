const express = require('express');
const crypto = require('crypto');
const { clerkClient, getAuth } = require('@clerk/express');
const { getDb } = require('../db/database');

const router = express.Router();

function clerkEnabled() {
  return Boolean(process.env.CLERK_SECRET_KEY && process.env.CLERK_PUBLISHABLE_KEY);
}

function normalizeEmail(v) {
  return String(v || '').trim().toLowerCase();
}

async function currentUser(req) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated || !userId) return null;
  const u = await clerkClient.users.getUser(userId);
  const email = normalizeEmail(u?.emailAddresses?.[0]?.emailAddress || '');
  return { clerkUserId: userId, email };
}

function requireClerkOn(req, res, next) {
  if (!clerkEnabled()) return res.status(503).json({ error: 'Clerk desabilitado' });
  next();
}

async function ensurePlatformUser(req, roleDefault = 'aluno') {
  const db = getDb();
  const me = await currentUser(req);
  if (!me) return null;
  let row = db.prepare('SELECT * FROM platform_users WHERE clerk_user_id = ?').get(me.clerkUserId);
  if (!row) {
    db.prepare('INSERT INTO platform_users (clerk_user_id, email, role) VALUES (?,?,?)')
      .run(me.clerkUserId, me.email, roleDefault);
    row = db.prepare('SELECT * FROM platform_users WHERE clerk_user_id = ?').get(me.clerkUserId);
  } else if (me.email && me.email !== row.email) {
    db.prepare("UPDATE platform_users SET email=?, updated_at=datetime('now') WHERE id=?").run(me.email, row.id);
    row.email = me.email;
  }
  return row;
}

async function requireRole(req, res, role) {
  const me = await ensurePlatformUser(req);
  if (!me) {
    res.status(401).json({ error: 'Não autenticado' });
    return null;
  }
  if (me.role !== role) {
    res.status(403).json({ error: `Acesso restrito para role ${role}` });
    return null;
  }
  return me;
}

router.get('/me', requireClerkOn, async (req, res) => {
  try {
    const me = await ensurePlatformUser(req);
    if (!me) return res.status(401).json({ error: 'Não autenticado' });
    return res.json(me);
  } catch {
    return res.status(500).json({ error: 'Falha ao consultar usuário' });
  }
});

// Bootstrapping do root: primeiro usuário com email permitido vira root.
router.post('/bootstrap-root', requireClerkOn, async (req, res) => {
  try {
    const me = await currentUser(req);
    if (!me) return res.status(401).json({ error: 'Não autenticado' });
    const roots = (process.env.PLATFORM_ROOT_EMAILS || '')
      .split(',')
      .map(normalizeEmail)
      .filter(Boolean);
    const db = getDb();
    const hasRoot = db.prepare("SELECT id FROM platform_users WHERE role='root' LIMIT 1").get();
    if (roots.length > 0) {
      if (!roots.includes(me.email)) return res.status(403).json({ error: 'Email não autorizado para root' });
    } else if (hasRoot) {
      return res.status(409).json({ error: 'Root já existe. Configure PLATFORM_ROOT_EMAILS para promover outro root.' });
    }
    let row = db.prepare('SELECT * FROM platform_users WHERE clerk_user_id=?').get(me.clerkUserId);
    if (!row) {
      db.prepare('INSERT INTO platform_users (clerk_user_id,email,role) VALUES (?,?,?)')
        .run(me.clerkUserId, me.email, 'root');
    } else {
      db.prepare("UPDATE platform_users SET role='root', email=?, updated_at=datetime('now') WHERE id=?")
        .run(me.email, row.id);
    }
    row = db.prepare('SELECT * FROM platform_users WHERE clerk_user_id=?').get(me.clerkUserId);
    return res.json({ ok: true, user: row });
  } catch {
    return res.status(500).json({ error: 'Falha no bootstrap root' });
  }
});

router.post('/invite/professor', requireClerkOn, async (req, res) => {
  const root = await requireRole(req, res, 'root');
  if (!root) return;
  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(400).json({ error: 'email obrigatório' });
  const db = getDb();
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare(`
    INSERT INTO platform_invites (token, type, email, invited_by_clerk_id, expires_at)
    VALUES (?,?,?,?, datetime('now', '+7 days'))
  `).run(token, 'professor', email, root.clerk_user_id);
  const link = `${process.env.APP_BASE_URL || ''}/auth/sign-up.html?invite=${token}&role=professor`;
  res.status(201).json({ ok: true, token, link });
});

router.post('/invite/aluno', requireClerkOn, async (req, res) => {
  const professor = await requireRole(req, res, 'professor');
  if (!professor) return;
  const email = normalizeEmail(req.body?.email);
  if (!email) return res.status(400).json({ error: 'email obrigatório' });
  const db = getDb();
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare(`
    INSERT INTO platform_invites (token, type, email, professor_user_id, invited_by_clerk_id, expires_at)
    VALUES (?,?,?,?,?, datetime('now', '+7 days'))
  `).run(token, 'aluno', email, professor.id, professor.clerk_user_id);
  const link = `${process.env.APP_BASE_URL || ''}/auth/sign-up.html?invite=${token}&role=aluno`;
  res.status(201).json({ ok: true, token, link });
});

router.post('/invite/accept', requireClerkOn, async (req, res) => {
  try {
    const token = String(req.body?.token || '').trim();
    if (!token) return res.status(400).json({ error: 'token obrigatório' });
    const actor = await currentUser(req);
    if (!actor) return res.status(401).json({ error: 'Não autenticado' });
    const db = getDb();
    const invite = db.prepare('SELECT * FROM platform_invites WHERE token = ?').get(token);
    if (!invite) return res.status(404).json({ error: 'Convite não encontrado' });
    if (invite.status !== 'pending') return res.status(409).json({ error: `Convite ${invite.status}` });
    const me = await ensurePlatformUser(req, invite.type === 'professor' ? 'professor' : 'aluno');
    if (invite.email && me.email && normalizeEmail(invite.email) !== normalizeEmail(me.email)) {
      return res.status(403).json({ error: 'Email não corresponde ao convite' });
    }
    if (invite.type === 'professor') {
      db.prepare("UPDATE platform_users SET role='professor', updated_at=datetime('now') WHERE id=?").run(me.id);
    } else {
      db.prepare("UPDATE platform_users SET role='aluno', updated_at=datetime('now') WHERE id=?").run(me.id);
      if (invite.professor_user_id) {
        db.prepare('INSERT OR IGNORE INTO professor_students (professor_user_id, student_user_id) VALUES (?,?)')
          .run(invite.professor_user_id, me.id);
      }
    }
    db.prepare(`
      UPDATE platform_invites
      SET status='accepted', accepted_by_clerk_id=?, accepted_at=datetime('now')
      WHERE id=?
    `).run(actor.clerkUserId, invite.id);
    const updated = db.prepare('SELECT * FROM platform_users WHERE id=?').get(me.id);
    return res.json({ ok: true, role: updated.role, user: updated });
  } catch {
    return res.status(500).json({ error: 'Falha ao aceitar convite' });
  }
});

router.get('/professores', requireClerkOn, async (req, res) => {
  const root = await requireRole(req, res, 'root');
  if (!root) return;
  const rows = getDb().prepare("SELECT id, email, role, status, created_at FROM platform_users WHERE role='professor' ORDER BY id DESC").all();
  res.json(rows);
});

router.get('/alunos', requireClerkOn, async (req, res) => {
  const professor = await requireRole(req, res, 'professor');
  if (!professor) return;
  const rows = getDb().prepare(`
    SELECT u.id, u.email, u.role, u.status, u.created_at
    FROM professor_students ps
    JOIN platform_users u ON u.id = ps.student_user_id
    WHERE ps.professor_user_id = ?
    ORDER BY u.id DESC
  `).all(professor.id);
  res.json(rows);
});

module.exports = router;

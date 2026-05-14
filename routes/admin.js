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

// ── Utilitários ──────────────────────────────────────────────────────────

// Sanitiza HTML removendo tags e atributos perigosos (alunos renderizam o conteúdo)
function sanitizeHtml(str) {
  return String(str)
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe\b[\s\S]*?<\/iframe>/gi, '')
    .replace(/<object\b[\s\S]*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*>/gi, '')
    .replace(/<link\b[^>]*>/gi, '')
    .replace(/<meta\b[^>]*>/gi, '')
    .replace(/\s+on\w+=(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/\bjavascript\s*:/gi, 'removed:')
    .replace(/\bdata\s*:\s*text\/html/gi, 'removed:');
}

function str(v, max) { return String(v || '').trim().slice(0, max); }
function num(v, def, min, max) {
  const n = Number(v);
  if (isNaN(n)) return def;
  return Math.min(Math.max(n, min), max);
}

function tryRun(res, fn) {
  try { return fn(); }
  catch (e) {
    if (e.message?.includes('UNIQUE')) return res.status(409).json({ erro: 'Valor duplicado (slug ou constraint única)' });
    if (e.message?.includes('FOREIGN KEY')) return res.status(404).json({ erro: 'Recurso pai não encontrado' });
    console.error('[admin api]', e.message);
    res.status(500).json({ erro: 'Erro interno' });
  }
}

// ── MÓDULOS ──────────────────────────────────────────────────────────────

router.get('/modulos', requireAdminApi, (req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT m.*, COUNT(b.id) AS total_blocos
    FROM modulos m LEFT JOIN blocos b ON b.modulo_id = m.id
    GROUP BY m.id ORDER BY m.ordem, m.id
  `).all();
  res.json(rows);
});

router.post('/modulos', requireAdminApi, (req, res) => {
  const { slug, titulo, subtitulo, duracao_min, ordem } = req.body || {};
  if (!slug || !titulo) return res.status(400).json({ erro: 'slug e titulo são obrigatórios' });
  if (!/^[a-z0-9-]+$/.test(slug)) return res.status(400).json({ erro: 'slug: apenas minúsculas, números e hífens' });
  tryRun(res, () => {
    const db = getDb();
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO modulos (slug, titulo, subtitulo, duracao_min, ordem) VALUES (?,?,?,?,?)'
    ).run(str(slug, 80), str(titulo, 200), subtitulo ? str(subtitulo, 200) : null, num(duracao_min, 90, 1, 600), num(ordem, 0, 0, 9999));
    res.status(201).json(db.prepare('SELECT * FROM modulos WHERE id = ?').get(lastInsertRowid));
  });
});

router.put('/modulos/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const mod = db.prepare('SELECT id FROM modulos WHERE id = ?').get(Number(req.params.id));
  if (!mod) return res.status(404).json({ erro: 'Módulo não encontrado' });
  const { titulo, subtitulo, duracao_min, ordem } = req.body || {};
  tryRun(res, () => {
    db.prepare('UPDATE modulos SET titulo=?, subtitulo=?, duracao_min=?, ordem=?, atualizado_em=datetime(\'now\') WHERE id=?')
      .run(str(titulo, 200), subtitulo ? str(subtitulo, 200) : null, num(duracao_min, 90, 1, 600), num(ordem, 0, 0, 9999), mod.id);
    res.json(db.prepare('SELECT * FROM modulos WHERE id = ?').get(mod.id));
  });
});

router.delete('/modulos/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const mod = db.prepare('SELECT id FROM modulos WHERE id = ?').get(Number(req.params.id));
  if (!mod) return res.status(404).json({ erro: 'Módulo não encontrado' });
  db.prepare('DELETE FROM modulos WHERE id = ?').run(mod.id);
  res.json({ ok: true });
});

router.put('/modulos/:id/publicar', requireAdminApi, (req, res) => {
  const db = getDb();
  const mod = db.prepare('SELECT id, publicado FROM modulos WHERE id = ?').get(Number(req.params.id));
  if (!mod) return res.status(404).json({ erro: 'Módulo não encontrado' });
  const novoStatus = mod.publicado ? 0 : 1;
  db.prepare('UPDATE modulos SET publicado=?, atualizado_em=datetime(\'now\') WHERE id=?').run(novoStatus, mod.id);
  res.json({ publicado: novoStatus });
});

// ── SESSÃO DE AULA ────────────────────────────────────────────────────────

router.put('/sessao/modulo', requireAdminApi, (req, res) => {
  const { slug } = req.body || {};
  if (!slug) return res.status(400).json({ erro: 'slug é obrigatório' });
  const db = getDb();
  const mod = db.prepare('SELECT id, slug, titulo FROM modulos WHERE slug = ? AND publicado = 1').get(str(slug, 80));
  if (!mod) return res.status(404).json({ erro: 'Módulo não encontrado ou não publicado' });
  // Armazena no app para uso do Sprint 5 (integração com WebSocket)
  req.app.set('moduloAtivoSlug', mod.slug);
  res.json({ ativo: mod });
});

router.get('/sessao/modulo', requireAdminApi, (req, res) => {
  const slug = req.app.get('moduloAtivoSlug') || null;
  if (!slug) return res.json({ ativo: null });
  const mod = getDb().prepare('SELECT id, slug, titulo FROM modulos WHERE slug = ?').get(slug);
  res.json({ ativo: mod || null });
});

// ── BLOCOS ────────────────────────────────────────────────────────────────

router.get('/modulos/:moduloId/blocos', requireAdminApi, (req, res) => {
  const db = getDb();
  const mod = db.prepare('SELECT id FROM modulos WHERE id = ?').get(Number(req.params.moduloId));
  if (!mod) return res.status(404).json({ erro: 'Módulo não encontrado' });
  res.json(db.prepare('SELECT * FROM blocos WHERE modulo_id = ? ORDER BY ordem, id').all(mod.id));
});

router.post('/modulos/:moduloId/blocos', requireAdminApi, (req, res) => {
  const db = getDb();
  const mod = db.prepare('SELECT id FROM modulos WHERE id = ?').get(Number(req.params.moduloId));
  if (!mod) return res.status(404).json({ erro: 'Módulo não encontrado' });
  const { eye, titulo, corpo_html, svg, tempo_min, tem_pergunta, pergunta_padrao, roteiro_fala, roteiro_notas, ordem } = req.body || {};
  if (!titulo) return res.status(400).json({ erro: 'titulo é obrigatório' });
  tryRun(res, () => {
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO blocos (modulo_id, ordem, eye, titulo, corpo_html, svg, tempo_min, tem_pergunta, pergunta_padrao, roteiro_fala, roteiro_notas)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)
    `).run(mod.id, num(ordem, 0, 0, 9999), str(eye, 100), str(titulo, 300),
        sanitizeHtml(corpo_html || '').slice(0, 50000), sanitizeHtml(svg || '').slice(0, 100000),
        num(tempo_min, 10, 1, 120), tem_pergunta ? 1 : 0,
        pergunta_padrao ? str(pergunta_padrao, 500) : null,
        str(roteiro_fala, 5000), roteiro_notas ? JSON.stringify(roteiro_notas).slice(0, 10000) : '[]');
    res.status(201).json(db.prepare('SELECT * FROM blocos WHERE id = ?').get(lastInsertRowid));
  });
});

router.put('/blocos/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const bloco = db.prepare('SELECT id FROM blocos WHERE id = ?').get(Number(req.params.id));
  if (!bloco) return res.status(404).json({ erro: 'Bloco não encontrado' });
  const { eye, titulo, corpo_html, svg, tempo_min, tem_pergunta, pergunta_padrao, roteiro_fala, roteiro_notas, ordem, publicado } = req.body || {};
  tryRun(res, () => {
    db.prepare(`UPDATE blocos SET eye=?, titulo=?, corpo_html=?, svg=?, tempo_min=?, tem_pergunta=?,
      pergunta_padrao=?, roteiro_fala=?, roteiro_notas=?, ordem=?, publicado=?, atualizado_em=datetime('now') WHERE id=?`)
      .run(str(eye, 100), str(titulo, 300), sanitizeHtml(corpo_html || '').slice(0, 50000),
        sanitizeHtml(svg || '').slice(0, 100000), num(tempo_min, 10, 1, 120), tem_pergunta ? 1 : 0,
        pergunta_padrao ? str(pergunta_padrao, 500) : null, str(roteiro_fala, 5000),
        roteiro_notas ? JSON.stringify(roteiro_notas).slice(0, 10000) : '[]',
        num(ordem, 0, 0, 9999), publicado !== undefined ? (publicado ? 1 : 0) : 1, bloco.id);
    res.json(db.prepare('SELECT * FROM blocos WHERE id = ?').get(bloco.id));
  });
});

router.put('/blocos/:id/ordem', requireAdminApi, (req, res) => {
  const db = getDb();
  const bloco = db.prepare('SELECT id FROM blocos WHERE id = ?').get(Number(req.params.id));
  if (!bloco) return res.status(404).json({ erro: 'Bloco não encontrado' });
  const ordem = num(req.body?.ordem, 0, 0, 9999);
  db.prepare("UPDATE blocos SET ordem=?, atualizado_em=datetime('now') WHERE id=?").run(ordem, bloco.id);
  res.json({ ok: true, ordem });
});

router.delete('/blocos/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const bloco = db.prepare('SELECT id FROM blocos WHERE id = ?').get(Number(req.params.id));
  if (!bloco) return res.status(404).json({ erro: 'Bloco não encontrado' });
  db.prepare('DELETE FROM blocos WHERE id = ?').run(bloco.id);
  res.json({ ok: true });
});

// ── QUIZZES ───────────────────────────────────────────────────────────────

router.get('/blocos/:blocoId/quizzes', requireAdminApi, (req, res) => {
  const db = getDb();
  const bloco = db.prepare('SELECT id FROM blocos WHERE id = ?').get(Number(req.params.blocoId));
  if (!bloco) return res.status(404).json({ erro: 'Bloco não encontrado' });
  res.json(db.prepare('SELECT * FROM quizzes WHERE bloco_id = ? ORDER BY ordem, id').all(bloco.id));
});

router.post('/blocos/:blocoId/quizzes', requireAdminApi, (req, res) => {
  const db = getDb();
  const bloco = db.prepare('SELECT id FROM blocos WHERE id = ?').get(Number(req.params.blocoId));
  if (!bloco) return res.status(404).json({ erro: 'Bloco não encontrado' });
  const { pergunta, opcao_a, opcao_b, opcao_c, opcao_d, correta, tempo_seg, ordem } = req.body || {};
  if (!pergunta || !opcao_a || !opcao_b || !opcao_c || !opcao_d)
    return res.status(400).json({ erro: 'pergunta e todas as 4 opções são obrigatórias' });
  if (![0,1,2,3].includes(Number(correta)))
    return res.status(400).json({ erro: 'correta deve ser 0, 1, 2 ou 3' });
  tryRun(res, () => {
    const { lastInsertRowid } = db.prepare(
      'INSERT INTO quizzes (bloco_id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, correta, tempo_seg, ordem) VALUES (?,?,?,?,?,?,?,?,?)'
    ).run(bloco.id, str(pergunta, 500), str(opcao_a, 200), str(opcao_b, 200), str(opcao_c, 200), str(opcao_d, 200),
        Number(correta), num(tempo_seg, 20, 5, 120), num(ordem, 0, 0, 9999));
    res.status(201).json(db.prepare('SELECT * FROM quizzes WHERE id = ?').get(lastInsertRowid));
  });
});

router.put('/quizzes/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(Number(req.params.id));
  if (!quiz) return res.status(404).json({ erro: 'Quiz não encontrado' });
  const { pergunta, opcao_a, opcao_b, opcao_c, opcao_d, correta, tempo_seg, ordem } = req.body || {};
  if (correta !== undefined && ![0,1,2,3].includes(Number(correta)))
    return res.status(400).json({ erro: 'correta deve ser 0, 1, 2 ou 3' });
  const corretaFinal = correta !== undefined ? Number(correta) : quiz.correta;
  tryRun(res, () => {
    db.prepare('UPDATE quizzes SET pergunta=?, opcao_a=?, opcao_b=?, opcao_c=?, opcao_d=?, correta=?, tempo_seg=?, ordem=? WHERE id=?')
      .run(str(pergunta, 500), str(opcao_a, 200), str(opcao_b, 200), str(opcao_c, 200), str(opcao_d, 200),
          corretaFinal, num(tempo_seg, 20, 5, 120), num(ordem, 0, 0, 9999), quiz.id);
    res.json(db.prepare('SELECT * FROM quizzes WHERE id = ?').get(quiz.id));
  });
});

router.delete('/quizzes/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const quiz = db.prepare('SELECT id FROM quizzes WHERE id = ?').get(Number(req.params.id));
  if (!quiz) return res.status(404).json({ erro: 'Quiz não encontrado' });
  db.prepare('DELETE FROM quizzes WHERE id = ?').run(quiz.id);
  res.json({ ok: true });
});

// ── EXERCÍCIOS ────────────────────────────────────────────────────────────

const TIPOS_EXERCICIO = ['cenario_4d', 'chat_livre', 'reflexao'];

router.get('/blocos/:blocoId/exercicios', requireAdminApi, (req, res) => {
  const db = getDb();
  const bloco = db.prepare('SELECT id FROM blocos WHERE id = ?').get(Number(req.params.blocoId));
  if (!bloco) return res.status(404).json({ erro: 'Bloco não encontrado' });
  res.json(db.prepare('SELECT * FROM exercicios WHERE bloco_id = ? ORDER BY ordem, id').all(bloco.id));
});

router.post('/blocos/:blocoId/exercicios', requireAdminApi, (req, res) => {
  const db = getDb();
  const bloco = db.prepare('SELECT id FROM blocos WHERE id = ?').get(Number(req.params.blocoId));
  if (!bloco) return res.status(404).json({ erro: 'Bloco não encontrado' });
  const { tipo, ordem } = req.body || {};
  if (!TIPOS_EXERCICIO.includes(tipo))
    return res.status(400).json({ erro: `tipo deve ser: ${TIPOS_EXERCICIO.join(', ')}` });
  tryRun(res, () => {
    const { lastInsertRowid } = db.prepare('INSERT INTO exercicios (bloco_id, tipo, ordem) VALUES (?,?,?)')
      .run(bloco.id, tipo, num(ordem, 0, 0, 9999));
    res.status(201).json(db.prepare('SELECT * FROM exercicios WHERE id = ?').get(lastInsertRowid));
  });
});

router.put('/exercicios/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const ex = db.prepare('SELECT id FROM exercicios WHERE id = ?').get(Number(req.params.id));
  if (!ex) return res.status(404).json({ erro: 'Exercício não encontrado' });
  const { tipo, ordem } = req.body || {};
  if (tipo && !TIPOS_EXERCICIO.includes(tipo))
    return res.status(400).json({ erro: `tipo deve ser: ${TIPOS_EXERCICIO.join(', ')}` });
  db.prepare('UPDATE exercicios SET tipo=?, ordem=? WHERE id=?')
    .run(tipo || 'cenario_4d', num(ordem, 0, 0, 9999), ex.id);
  res.json(db.prepare('SELECT * FROM exercicios WHERE id = ?').get(ex.id));
});

router.delete('/exercicios/:id', requireAdminApi, (req, res) => {
  const db = getDb();
  const ex = db.prepare('SELECT id FROM exercicios WHERE id = ?').get(Number(req.params.id));
  if (!ex) return res.status(404).json({ erro: 'Exercício não encontrado' });
  db.prepare('DELETE FROM exercicios WHERE id = ?').run(ex.id);
  res.json({ ok: true });
});

module.exports = router;

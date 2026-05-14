# Node.js Backend — Padrões de Segurança

> Sources: Auditoria do Sistema Zatto de Escola, 2026-05-13
> Raw: [Bugs e Padrões Corrigidos — Sistema Zatto de Escola](../../raw/knowledge-management/2026-05-13-bugs-corrigidos-zatto-escola.md)

## Overview

Padrões de segurança e robustez para APIs Express e handlers WebSocket, derivados de auditoria de código de produção.

## Sanitização HTML

Regex cobre casos óbvios mas não edge cases Unicode. Mínimo necessário:

```js
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
```

Para conteúdo crítico, usar `sanitize-html` ou `DOMPurify` (server-side com jsdom).

## Endpoints de Atualização Parcial

Em PUT/PATCH, nunca usar valor padrão fixo para campos críticos quando não enviados:

```js
// ❌ Sobrescreve silenciosamente com 0
Number(correta ?? 0)

// ✅ Buscar valor atual do banco como fallback
const registro = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(id);
const corretaFinal = correta !== undefined ? Number(correta) : registro.correta;
```

## Autenticação Anti-Timing Attack

```js
// Comparar sempre, mesmo se usuário não existe (evita enumerar usuários por tempo de resposta)
const hash = user?.password_hash || '$2b$12$invalido.hash.para.comparacao.segura';
const match = await bcrypt.compare(String(password).slice(0, 200), hash);
if (!user || !match) return res.status(401).json({ erro: 'Credenciais inválidas' });
```

## Rate Limiting em Login

```js
const loginAttempts = new Map(); // ip → { count, resetAt }

// Limpar entradas expiradas periodicamente
setInterval(() => {
  const now = Date.now();
  for (const [ip, e] of loginAttempts) {
    if (now > e.resetAt) loginAttempts.delete(ip);
  }
}, 30 * 60 * 1000);
```

## Helpers de Validação Reutilizáveis

```js
function str(v, max) { return String(v || '').trim().slice(0, max); }
function num(v, def, min, max) {
  const n = Number(v);
  if (isNaN(n)) return def;
  return Math.min(Math.max(n, min), max);
}
```

## Segurança de Sessão Express

```js
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60 * 1000,
  },
}));

// Session fixation prevention no login
req.session.regenerate((err) => {
  req.session.adminId = user.id;
  // ...
});
```

## Erros de Banco de Dados Amigáveis

```js
function tryRun(res, fn) {
  try { return fn(); }
  catch (e) {
    if (e.message?.includes('UNIQUE'))
      return res.status(409).json({ erro: 'Valor duplicado' });
    if (e.message?.includes('FOREIGN KEY'))
      return res.status(404).json({ erro: 'Recurso pai não encontrado' });
    console.error('[api]', e.message);
    res.status(500).json({ erro: 'Erro interno' });
  }
}
```

## See Also

- [WebSocket — Padrões e Armadilhas](websocket-patterns-e-armadilhas.md)

require('dotenv').config();
const express  = require('express');
const session  = require('express-session');
const bcrypt   = require('bcrypt');
const { WebSocketServer } = require('ws');
const http     = require('http');
const path     = require('path');
const { getDb }        = require('./db/database.js');
const adminRouter      = require('./routes/admin.js');
const contentRouter    = require('./routes/content.js');
const { requireAdminPage } = require('./middleware/adminAuth.js');

const app    = express();
const server = http.createServer(app);
const wss    = new WebSocketServer({ server });

// ── Garante que SESSION_SECRET existe ────────────────────────
if (!process.env.SESSION_SECRET) {
  console.error('[erro] SESSION_SECRET não definido no .env');
  process.exit(1);
}

// ── Cria primeiro admin e só então inicia o servidor ─────────
// (garante que login funciona desde a primeira requisição)
async function iniciar() {
  const db = getDb();
  const existe = db.prepare('SELECT id FROM admin_users LIMIT 1').get();
  if (!existe) {
    const user = process.env.ADMIN_USER || 'admin';
    const pass = process.env.ADMIN_PASSWORD;
    if (!pass) {
      console.warn('[admin] ADMIN_PASSWORD não definido — nenhum usuário admin criado');
    } else {
      const hash = await bcrypt.hash(pass, 12);
      db.prepare('INSERT INTO admin_users (username, password_hash, nome) VALUES (?,?,?)')
        .run(user, hash, 'Administrador');
      console.log(`[admin] Usuário "${user}" criado`);
    }
  }

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Plataforma rodando em http://localhost:${PORT}`);
    console.log(`  Professor: http://localhost:${PORT}/professor.html`);
    console.log(`  Aluno:     http://localhost:${PORT}/aluno.html`);
    console.log(`  Admin:     http://localhost:${PORT}/admin`);
  });
}

server.on('error', err => { console.error('[server error]', err.message); process.exit(1); });
iniciar().catch(err => { console.error('[fatal]', err); process.exit(1); });

// ── Middlewares globais ──────────────────────────────────────
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  next();
});

app.use(express.json({ limit: '64kb' }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 8 * 60 * 60 * 1000, // 8 horas
  },
}));

// ── API admin (rotas públicas: login/logout) ─────────────────
app.use('/api/admin', adminRouter);

// ── API conteúdo (pública — usada pela aula ao vivo) ─────────
app.use('/api/content', contentRouter);

// ── Sessão da aula (módulo ativo + código da sala) ────────────
app.get('/api/session', (req, res) => {
  res.json({
    moduloSlug: req.app.get('moduloAtivoSlug') || null,
    code: roomCode,
  });
});

// ── Protege acesso direto a /admin/*.html (exceto index.html) ─
app.use('/admin', (req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') return next();
  requireAdminPage(req, res, next);
});

app.use(express.static(path.join(__dirname, 'public')));

// ── Código da sala ───────────────────────────────────────────
function gerarCodigo() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
let roomCode = gerarCodigo();

app.get('/api/join', (req, res) => {
  const code = (req.query.code || '').toUpperCase().trim();
  res.json({ valid: code === roomCode });
});

app.get('/api/room-code', (req, res) => {
  res.json({ code: roomCode });
});

// Estado da aula em memória
let aulaState = {
  blocoLiberado: -1,
  perguntaAtiva: null,
  respostas: [],
  quiz: null,      // { pergunta, opcoes, correta, tempo, respostas: Map<ws, {opcao,tempo_ms,nome}> }
  exercicio: null, // { tipo, respostas: [{nome, dados, ts}] }
  camAtiva: false,
};

let _nextClientId = 1;

// Clientes separados por tipo
const professores = new Set();
const alunos = new Map(); // ws → { nome, foto }

function alunosOnlineCount() {
  return alunos.size;
}

function broadcast(data, exclude = null) {
  const msg = JSON.stringify(data);
  for (const client of wss.clients) {
    if (client !== exclude && client.readyState === 1) {
      client.send(msg);
    }
  }
}

function sendState(ws) {
  ws.send(JSON.stringify({
    type: 'state_update',
    blocoLiberado: aulaState.blocoLiberado,
    perguntaAtiva: aulaState.perguntaAtiva,
    respostas: aulaState.respostas,
    alunosOnline: alunosOnlineCount(),
    nomeAlunos: [...alunos.values()].map(a => a.nome),
    alunosFotos: [...alunos.values()].map(a => ({ nome: a.nome, foto: a.foto || null })),
    camAtiva: aulaState.camAtiva,
  }));
}

function broadcastState() {
  const msg = JSON.stringify({
    type: 'state_update',
    blocoLiberado: aulaState.blocoLiberado,
    perguntaAtiva: aulaState.perguntaAtiva,
    respostas: aulaState.respostas,
    alunosOnline: alunosOnlineCount(),
    nomeAlunos: [...alunos.values()].map(a => a.nome),
    camAtiva: aulaState.camAtiva,
  });
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

wss.on('connection', (ws) => {
  ws._id = _nextClientId++;
  ws.send(JSON.stringify({ type: 'client_id', id: ws._id }));

  // Rate limiting
  ws._msgCount = 0;
  ws._msgReset = setInterval(() => { ws._msgCount = 0; }, 1000);
  ws._drawCount = 0;
  ws._drawReset = setInterval(() => { ws._drawCount = 0; }, 1000);

  ws.on('message', (raw) => {
    if (raw.length > 65536) return; // 64KB — aceita frames de câmera
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }
    if (msg.type === 'draw_stroke') {
      if (++ws._drawCount > 200) return;
    } else {
      if (++ws._msgCount > 20) return;
    }

    switch (msg.type) {
      case 'professor_connect': {
        professores.add(ws);
        sendState(ws);
        // Enviar fotos já existentes
        const fotos = [...alunos.values()].filter(a => a.foto).map(a => ({ nome: a.nome, foto: a.foto }));
        if (fotos.length) ws.send(JSON.stringify({ type: 'student_photos_batch', fotos }));
        break;
      }

      case 'aluno_connect': {
        const nome = (msg.nome || 'Aluno').trim().slice(0, 40);
        alunos.set(ws, { nome, foto: null });
        sendState(ws);
        broadcastState();
        break;
      }

      case 'liberar_bloco': {
        if (!professores.has(ws)) break;
        const bloco = Number(msg.bloco);
        if (isNaN(bloco) || bloco < 0) break;
        aulaState.blocoLiberado = bloco;
        broadcastState();
        break;
      }

      case 'enviar_pergunta': {
        if (!professores.has(ws)) break;
        const texto = (msg.texto || '').trim().slice(0, 300);
        if (!texto) break;
        aulaState.perguntaAtiva = { blocoId: msg.blocoId, texto, ts: Date.now() };
        aulaState.respostas = [];
        broadcastState();
        broadcast({ type: 'nova_pergunta', texto, blocoId: msg.blocoId });
        break;
      }

      case 'fechar_pergunta': {
        if (!professores.has(ws)) break;
        aulaState.perguntaAtiva = null;
        broadcastState();
        break;
      }

      case 'resposta_pergunta': {
        const nomeAluno = (alunos.get(ws) || {}).nome || 'Aluno';
        const textoResp = (msg.texto || '').trim().slice(0, 500);
        if (!textoResp) break;
        const resp = { nome: nomeAluno, texto: textoResp, ts: Date.now() };
        aulaState.respostas.push(resp);
        // Notifica professores com a nova resposta (lista em tempo real)
        for (const prof of professores) {
          if (prof.readyState === 1) {
            prof.send(JSON.stringify({ type: 'nova_resposta', nome: nomeAluno, texto: textoResp }));
          }
        }
        // Confirma para o aluno que respondeu
        ws.send(JSON.stringify({ type: 'resposta_confirmada', blocoId: msg.blocoId }));
        break;
      }

      case 'revelar_bolhas': {
        if (!professores.has(ws)) break;
        // Envia todas as respostas acumuladas para todos os alunos renderizarem como bolhas
        broadcast({ type: 'mostrar_bolhas', respostas: aulaState.respostas });
        break;
      }

      case 'fechar_bolhas': {
        if (!professores.has(ws)) break;
        broadcast({ type: 'fechar_bolhas' });
        break;
      }

      case 'cam_start': {
        if (!professores.has(ws)) break;
        aulaState.camAtiva = true;
        broadcastState();
        break;
      }

      case 'cam_stop': {
        if (!professores.has(ws)) break;
        aulaState.camAtiva = false;
        broadcastState();
        const camStopMsg = JSON.stringify({ type: 'cam_stop' });
        for (const [alunoWs] of alunos) {
          if (alunoWs.readyState === 1) alunoWs.send(camStopMsg);
        }
        break;
      }

      case 'student_photo': {
        if (!alunos.has(ws)) break;
        const fotoData = (msg.foto || '').slice(0, 32768); // máx 32KB
        if (!fotoData.startsWith('data:image/')) break;
        alunos.get(ws).foto = fotoData;
        const nome = alunos.get(ws).nome;
        const photoMsg = JSON.stringify({ type: 'student_photo', nome, foto: fotoData });
        for (const profWs of professores) {
          if (profWs.readyState === 1) profWs.send(photoMsg);
        }
        break;
      }

      case 'cam_subscribe': {
        // Aluno quer receber o vídeo → avisar o professor
        if (!alunos.has(ws)) break;
        for (const profWs of professores) {
          if (profWs.readyState === 1)
            profWs.send(JSON.stringify({ type: 'cam_subscribe', from: ws._id }));
        }
        break;
      }

      case 'cam_offer': {
        // Professor envia offer para aluno específico
        if (!professores.has(ws)) break;
        const targetOffer = [...wss.clients].find(c => c._id === msg.to);
        if (targetOffer?.readyState === 1)
          targetOffer.send(JSON.stringify({ type: 'cam_offer', sdp: msg.sdp }));
        break;
      }

      case 'cam_answer': {
        // Aluno responde com answer → professor
        if (!alunos.has(ws)) break;
        for (const profWs of professores) {
          if (profWs.readyState === 1)
            profWs.send(JSON.stringify({ type: 'cam_answer', from: ws._id, sdp: msg.sdp }));
        }
        break;
      }

      case 'cam_ice': {
        // ICE candidate — professor→aluno ou aluno→professor
        if (professores.has(ws)) {
          const targetIce = [...wss.clients].find(c => c._id === msg.to);
          if (targetIce?.readyState === 1)
            targetIce.send(JSON.stringify({ type: 'cam_ice', candidate: msg.candidate }));
        } else if (alunos.has(ws)) {
          for (const profWs of professores) {
            if (profWs.readyState === 1)
              profWs.send(JSON.stringify({ type: 'cam_ice', from: ws._id, candidate: msg.candidate }));
          }
        }
        break;
      }

      case 'draw_stroke': {
        if (!professores.has(ws)) break;
        const strokeMsg = JSON.stringify({ type: 'draw_stroke', blocoId: msg.blocoId, x0: msg.x0, y0: msg.y0, x1: msg.x1, y1: msg.y1, color: msg.color });
        for (const [alunoWs] of alunos) {
          if (alunoWs.readyState === 1) alunoWs.send(strokeMsg);
        }
        break;
      }

      case 'draw_clear': {
        if (!professores.has(ws)) break;
        const clearMsg = JSON.stringify({ type: 'draw_clear', blocoId: msg.blocoId });
        for (const [alunoWs] of alunos) {
          if (alunoWs.readyState === 1) alunoWs.send(clearMsg);
        }
        break;
      }

      case 'reset_aula': {
        if (!professores.has(ws)) break;
        aulaState = {
          blocoLiberado: -1,
          perguntaAtiva: null,
          respostas: [],
        };
        broadcastState();
        break;
      }

      case 'regenerar_codigo': {
        if (!professores.has(ws)) break;
        roomCode = gerarCodigo();
        ws.send(JSON.stringify({ type: 'novo_codigo', code: roomCode }));
        break;
      }

      case 'iniciar_quiz': {
        if (!professores.has(ws)) break;
        const pergunta = (msg.pergunta || '').trim().slice(0, 300);
        const opcoes = Array.isArray(msg.opcoes) ? msg.opcoes.slice(0,4).map(o => String(o).trim().slice(0, 120)) : [];
        const correta = Number(msg.correta);
        const tempo = Math.min(Math.max(Number(msg.tempo) || 20, 5), 120);
        if (!pergunta || opcoes.length !== 4 || isNaN(correta)) break;
        aulaState.quiz = { pergunta, opcoes, correta, tempo, respostas: new Map() };
        broadcast({ type: 'quiz_iniciado', pergunta, opcoes, tempo });
        break;
      }

      case 'resposta_quiz': {
        if (!aulaState.quiz || aulaState.quiz.respostas.has(ws)) break;
        const nomeAluno = (alunos.get(ws) || {}).nome || 'Aluno';
        const opcao = Number(msg.opcao);
        const tempo_ms = Number(msg.tempo_ms) || 0;
        if (opcao < 0 || opcao > 3 || isNaN(opcao)) break;
        aulaState.quiz.respostas.set(ws, { opcao, tempo_ms, nome: nomeAluno });
        const totalRespostas = aulaState.quiz.respostas.size;
        for (const prof of professores) {
          if (prof.readyState === 1)
            prof.send(JSON.stringify({ type: 'quiz_resposta_parcial', total: totalRespostas }));
        }
        ws.send(JSON.stringify({ type: 'quiz_resposta_confirmada', opcao }));
        break;
      }

      case 'revelar_resultado_quiz': {
        if (!professores.has(ws) || !aulaState.quiz) break;
        const { correta, respostas } = aulaState.quiz;
        const dist = [0, 0, 0, 0];
        const ranking = [];
        for (const [, r] of respostas) {
          dist[r.opcao]++;
          if (r.opcao === correta) ranking.push({ nome: r.nome, tempo_ms: r.tempo_ms });
        }
        ranking.sort((a, b) => a.tempo_ms - b.tempo_ms);
        broadcast({ type: 'quiz_resultado', correta, dist, total: respostas.size, ranking: ranking.slice(0, 5) });
        break;
      }

      case 'encerrar_quiz': {
        if (!professores.has(ws)) break;
        aulaState.quiz = null;
        broadcast({ type: 'quiz_encerrado' });
        break;
      }

      case 'iniciar_exercicio': {
        if (!professores.has(ws)) break;
        const tiposValidos = ['cenario_4d', 'chat_livre', 'reflexao'];
        const tipo = (msg.tipo || '').trim();
        if (!tiposValidos.includes(tipo)) break;
        aulaState.exercicio = { tipo, respostas: [] };
        broadcast({ type: 'exercicio_iniciado', tipo });
        break;
      }

      case 'resposta_exercicio': {
        if (!aulaState.exercicio) break;
        const nomeAluno = (alunos.get(ws) || {}).nome || 'Aluno';
        // Serializa e limita payload a 4KB
        let dados = {};
        try { dados = JSON.parse(JSON.stringify(msg.dados || {}).slice(0, 4096)); } catch {}
        const resp = { nome: nomeAluno, dados, ts: Date.now() };
        aulaState.exercicio.respostas.push(resp);
        for (const prof of professores) {
          if (prof.readyState === 1)
            prof.send(JSON.stringify({ type: 'exercicio_resposta', nome: nomeAluno, tipo: aulaState.exercicio.tipo, dados }));
        }
        ws.send(JSON.stringify({ type: 'exercicio_confirmado' }));
        break;
      }

      case 'encerrar_exercicio': {
        if (!professores.has(ws)) break;
        aulaState.exercicio = null;
        broadcast({ type: 'exercicio_encerrado' });
        break;
      }
    }
  });

  ws.on('close', () => {
    clearInterval(ws._msgReset);
    professores.delete(ws);
    aulaState.quiz?.respostas.delete(ws); // evita referência pendente de WS desconectado
    if (alunos.has(ws)) {
      alunos.delete(ws);
      broadcastState();
    }
  });
});


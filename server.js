const express = require('express');
const { WebSocketServer } = require('ws');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(path.join(__dirname, 'public')));

// Estado da aula em memória
let aulaState = {
  blocoLiberado: 0,
  perguntaAtiva: null,   // { blocoId, texto, ts }
  respostas: [],         // [{ nome, texto, ts }]
};

// Clientes separados por tipo
const professores = new Set();
const alunos = new Map(); // ws → nome

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
    nomeAlunos: [...alunos.values()],
  }));
}

function broadcastState() {
  const msg = JSON.stringify({
    type: 'state_update',
    blocoLiberado: aulaState.blocoLiberado,
    perguntaAtiva: aulaState.perguntaAtiva,
    respostas: aulaState.respostas,
    alunosOnline: alunosOnlineCount(),
    nomeAlunos: [...alunos.values()],
  });
  for (const client of wss.clients) {
    if (client.readyState === 1) client.send(msg);
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (raw) => {
    let msg;
    try { msg = JSON.parse(raw); } catch { return; }

    switch (msg.type) {
      case 'professor_connect': {
        professores.add(ws);
        sendState(ws);
        break;
      }

      case 'aluno_connect': {
        const nome = (msg.nome || 'Aluno').trim().slice(0, 40);
        alunos.set(ws, nome);
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
        const texto = (msg.texto || '').trim();
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
        const nomeAluno = alunos.get(ws) || 'Aluno';
        const textoResp = (msg.texto || '').trim();
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

      case 'reset_aula': {
        if (!professores.has(ws)) break;
        aulaState = {
          blocoLiberado: 0,
          perguntaAtiva: null,
          respostas: [],
        };
        broadcastState();
        break;
      }
    }
  });

  ws.on('close', () => {
    professores.delete(ws);
    if (alunos.has(ws)) {
      alunos.delete(ws);
      broadcastState();
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Plataforma rodando em http://localhost:${PORT}`);
  console.log(`  Professor: http://localhost:${PORT}/professor.html`);
  console.log(`  Aluno:     http://localhost:${PORT}/aluno.html`);
});

# WebSocket — Padrões e Armadilhas

> Sources: Auditoria do Sistema Zatto de Escola, 2026-05-13
> Raw: [Bugs e Padrões Corrigidos — Sistema Zatto de Escola](../../raw/knowledge-management/2026-05-13-bugs-corrigidos-zatto-escola.md)

## Overview

Padrões aprendidos construindo e depurando um servidor WebSocket em produção (Node.js + `ws`). Cobre ciclo de vida de conexões, validação de mensagens, consistência de estado e persistência.

## Ciclo de Vida da Conexão

**Regra:** Todo recurso criado em `connection` deve ser destruído em `close`.

```js
wss.on('connection', (ws) => {
  ws._msgReset  = setInterval(() => { ws._msgCount = 0; }, 1000);
  ws._drawReset = setInterval(() => { ws._drawCount = 0; }, 1000);

  ws.on('close', () => {
    clearInterval(ws._msgReset);
    clearInterval(ws._drawReset); // ← fácil de esquecer
    // limpar Maps, Sets, referências
  });
});
```

Se o `clearInterval` for esquecido, cada conexão/desconexão acumula um interval ativo — memory leak silencioso que degrada o processo ao longo do tempo.

## Validação de Mensagens Recebidas

Dados via WebSocket devem ser validados antes de qualquer uso, mesmo que só clientes "autorizados" possam enviar.

**Coordenadas numéricas:**
```js
const x0 = Number(msg.x0);
if (isNaN(x0)) break; // rejeitar silenciosamente
```

**Cor hex:**
```js
const color = String(msg.color || '').trim();
if (!/^#[0-9a-fA-F]{6}$/.test(color)) break;
```

**Objetos com limite de tamanho:**
```js
if (msg.dados !== null && typeof msg.dados === 'object' && !Array.isArray(msg.dados)) {
  if (JSON.stringify(msg.dados).length <= 4096) dados = msg.dados;
}
// Não re-serializar para cortar — corrompe Unicode multibyte
```

**SDP WebRTC:**
```js
const sdp = String(msg.sdp || '').slice(0, 16384);
if (!sdp) break;
```

**ICE candidate:**
```js
if (!msg.candidate || typeof msg.candidate !== 'object') break;
if (JSON.stringify(msg.candidate).length > 2048) break;
```

## Consistência de Estado Broadcast

Quando o mesmo payload de estado é enviado em múltiplos caminhos (conexão individual + broadcast), extrair uma função única de construção:

```js
// ❌ Duplicação — fácil de desincronizar
function sendState(ws) {
  ws.send(JSON.stringify({ ...campos, alunosFotos: [...] }));
}
function broadcastState() {
  // esqueceu alunosFotos aqui
  const msg = JSON.stringify({ ...campos });
}

// ✅ Fonte única
function buildStateMsg() {
  return { type: 'state_update', ...todosOsCampos, alunosFotos: [...] };
}
function sendState(ws)    { ws.send(JSON.stringify(buildStateMsg())); }
function broadcastState() {
  const msg = JSON.stringify(buildStateMsg());
  for (const c of wss.clients) if (c.readyState === 1) c.send(msg);
}
```

## Reset de Estado

Ao resetar estado global, recriar o objeto inteiro com todos os campos explícitos:

```js
// ❌ Reset parcial — campos antigos persistem
aulaState = { blocoLiberado: -1, perguntaAtiva: null, respostas: [] };
// quiz, exercicio, camAtiva ficam com valores anteriores!

// ✅ Reset completo
aulaState = {
  blocoLiberado: -1,
  perguntaAtiva: null,
  respostas: [],
  quiz: null,
  exercicio: null,
  camAtiva: false,
};
```

## Persistência de Estado

**roomCode / configurações de sessão:** persistir em arquivo simples com validação de formato ao carregar:

```js
function loadOrCreateRoomCode() {
  try {
    const saved = fs.readFileSync(ROOM_CODE_FILE, 'utf8').trim();
    if (/^[A-Z0-9]{6}$/.test(saved)) return saved;
  } catch {}
  const code = gerarCodigo();
  fs.writeFileSync(ROOM_CODE_FILE, code, 'utf8');
  return code;
}
```

**Respostas de usuários:** persistir imediatamente em banco, nunca confiar na memória:

```js
function persistirResposta(tipo, nomeAluno, blocoId, dados) {
  try {
    db.prepare('INSERT INTO aula_respostas (tipo, nome_aluno, bloco_id, dados) VALUES (?,?,?,?)')
      .run(tipo, nomeAluno, blocoId || null, JSON.stringify(dados));
  } catch (e) {
    console.error('[db] persistirResposta:', e.message);
  }
}
```

## Rate Limiting por Conexão

```js
ws._msgCount = 0;
ws._msgReset = setInterval(() => { ws._msgCount = 0; }, 1000);

if (msg.type === 'draw_stroke') {
  if (++ws._drawCount > 200) return; // desenho tem taxa mais alta
} else {
  if (++ws._msgCount > 20) return;
}
```

Limites diferentes por tipo de mensagem — eventos de desenho têm frequência legítima muito maior que mensagens de controle.

## See Also

- [LLM Wiki Workflow](llm-wiki-workflow.md)
- [Node.js Backend — Padrões de Segurança](nodejs-security-patterns.md)

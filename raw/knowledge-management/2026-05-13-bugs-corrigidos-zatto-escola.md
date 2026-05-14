# Bugs e Padrões Corrigidos — Sistema Zatto de Escola

> Source: Auditoria interna do código (server.js, routes/admin.js)
> Collected: 2026-05-13
> Published: 2026-05-13

## Contexto

Plataforma de aula interativa com Node.js/Express, WebSocket, WebRTC e SQLite. Auditoria identificou 10 problemas corrigidos numa única sessão.

## 1. Memory Leak — setInterval não limpo

**Arquivo:** server.js, close handler
**Problema:** `ws._drawReset` (setInterval para rate limit de draw) não era limpo ao desconectar.
**Correção:** `clearInterval(ws._drawReset)` adicionado no evento `close`.
**Lição:** Todo `setInterval` criado por conexão deve ter seu `clearInterval` correspondente no evento `close`.

## 2. Inconsistência de Estado — broadcastState vs sendState

**Arquivo:** server.js
**Problema:** Duas funções construíam o payload de estado diferente — `broadcastState` omitia `alunosFotos`. Professores que já estavam na sala não recebiam fotos de novos alunos.
**Correção:** Extraiu-se `buildStateMsg()` como fonte única. `sendState` e `broadcastState` passaram a usar o mesmo payload.
**Lição:** Sempre que há dois caminhos de código gerando o mesmo payload, extrair função única. Duplicação de payload é fonte silenciosa de bugs difíceis de rastrear.

## 3. Injeção via WebSocket — draw_stroke sem validação

**Arquivo:** server.js, case 'draw_stroke'
**Problema:** `color`, `x0`, `y0`, `x1`, `y1` eram repassados para todos os alunos sem nenhuma validação. Um professor poderia enviar cor como string arbitrária.
**Correção:** Validar cor com regex `/^#[0-9a-fA-F]{6}$/` e coordenadas com `Number()` + `isNaN()`.
**Lição:** Dados recebidos via WebSocket devem ser validados antes de broadcast, mesmo que só clientes autorizados possam enviar. Validar tipo, formato e range.

## 4. Payload sem limite — SDP/ICE WebRTC

**Arquivo:** server.js, cases cam_offer / cam_answer / cam_ice
**Problema:** SDP e ICE candidates eram repassados sem limite de tamanho. SDP grande ou malformado poderia ser amplificado.
**Correção:** SDP limitado a 16KB via `.slice(0, 16384)`. ICE candidate validado como objeto e serializado para checar tamanho (máx 2KB).
**Lição:** Sinalizadores WebRTC (SDP/ICE) devem ter limite de tamanho e validação de tipo antes de ser repassados. SDP típico tem ~2-4KB; 16KB é folga suficiente.

## 5. Estado Incompleto — reset_aula

**Arquivo:** server.js, case 'reset_aula'
**Problema:** Ao resetar a aula, `quiz`, `exercicio` e `camAtiva` não eram zerados. Estado ficava inconsistente após reset.
**Correção:** `aulaState` recriado com todos os campos explícitos, incluindo `quiz: null`, `exercicio: null`, `camAtiva: false`.
**Lição:** Ao resetar estado, recriar o objeto inteiro com todos os campos explícitos. Nunca confiar que campos ausentes se comportarão como `null`.

## 6. JSON Frágil — resposta_exercicio

**Arquivo:** server.js, case 'resposta_exercicio'
**Problema:** `JSON.stringify(msg.dados).slice(4096)` → `JSON.parse()` pode cortar no meio de um caractere Unicode multibyte, causando parse error silencioso.
**Correção:** Como `msg` já é objeto parseado do WebSocket, usar `msg.dados` diretamente. Verificar tamanho antes de aceitar: `JSON.stringify(msg.dados).length <= 4096`.
**Lição:** Não re-serializar e re-parsear objetos para limitá-los por tamanho. Verificar o tamanho serializado e rejeitar se exceder, mas usar o objeto original.

## 7. Volatilidade — roomCode em memória

**Arquivo:** server.js
**Problema:** Código da sala gerado em memória a cada inicialização. Reiniciar o servidor invalida todos os links de alunos.
**Correção:** Persistir em arquivo `.room_code`. Ao iniciar, tentar ler o arquivo; gerar novo apenas se não existir ou formato inválido. Ao regenerar, sobrescrever o arquivo.
**Lição:** Qualquer estado que deve sobreviver a restarts (códigos, configurações, sessão da aula) precisa de persistência. SQLite ou arquivo simples dependendo da criticidade.

## 8. Sanitização HTML Incompleta

**Arquivo:** routes/admin.js, sanitizeHtml()
**Problema:** Regex removia apenas `<script>` e event handlers (`on*=`). Não cobria `<iframe>`, `<embed>`, `<object>`, `javascript:`, `data:text/html`.
**Correção:** Adicionadas regexes para todas as tags perigosas e protocolos maliciosos.
**Lição:** Sanitização HTML por regex é inerentemente frágil. Para produção crítica, usar biblioteca dedicada (sanitize-html, DOMPurify). Regex cobre casos óbvios mas não edge cases Unicode ou combinações.

## 9. Fallback Silencioso — correta em PUT quiz

**Arquivo:** routes/admin.js, PUT /quizzes/:id
**Problema:** `Number(correta ?? 0)` usava 0 se `correta` não fosse enviado — sobrescrevia silenciosamente a resposta correta do quiz.
**Correção:** Buscar o registro atual do banco (`SELECT *`), usar `quiz.correta` como fallback se o campo não for enviado.
**Lição:** Em endpoints de atualização parcial, nunca usar valor padrão fixo para campos críticos. Buscar o valor atual do banco e usar como fallback.

## 10. Respostas sem Persistência

**Arquivo:** server.js + nova migration
**Problema:** Respostas de perguntas, quizzes e exercícios viviam apenas em memória. Restart do servidor = perda total.
**Correção:** Migration `002_aula_respostas.sql` cria tabela com `tipo`, `nome_aluno`, `bloco_id`, `dados` (JSON). Função `persistirResposta()` chamada nos três handlers.
**Lição:** Dados gerados por usuários durante uma sessão (mesmo que temporária) devem ser persistidos imediatamente. Crash ou deploy não deve apagar histórico.

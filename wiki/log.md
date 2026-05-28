# Wiki Log

## [2026-05-13] ingest | LLM Wiki Workflow

## [2026-05-13] ingest | Obsidian como Sistema de Gestão de Conhecimento
- Updated: LLM Wiki Workflow

## [2026-05-13] ingest | WebSocket — Padrões e Armadilhas
- Updated: Node.js Backend — Padrões de Segurança

## [2026-05-14] ingest | Clerk Auth Flow — Roles e Roteamento

## [2026-05-28] ops | Chamada Octoagent no projeto
- Updated: 2026-05-28-octogent-call

## [2026-05-28] ops | Octoagent iniciado com sucesso
- Updated: 2026-05-28-octogent-start-success

## [2026-05-28] ops | Correção global Octoagent
- Updated: 2026-05-28-octogent-global-fix

## [2026-05-28] ops | Correção conexão Firefox Octogent
- Updated: 2026-05-28-octogent-firefox-connection-fix

## [2026-05-28] ops | Start persistente Octogent
- Updated: 2026-05-28-octogent-persistent-start

## [2026-05-28] ops | Fix NetworkError setup Octogent
- Updated: 2026-05-28-octogent-networkerror-setup-fix

## [2026-05-28] ingest | Next.js 16 + Monorepo — Padrões e Armadilhas

## [2026-05-28] ops | Default provider Octogent = Codex
- Updated: 2026-05-28-octogent-default-codex

## [2026-05-28] ops | Setup tentáculo coordenador-raiz
- Updated: 2026-05-28-octogent-coordenador-raiz-setup

## [2026-05-28] ops | Skills do coordenador-raiz alocadas
- Updated: 2026-05-28-coordenador-skills-alocadas

## [2026-05-28] ops | Ordem de orquestradores atualizada
- Updated: 2026-05-28-ordem-orquestradores-coordenador

## [2026-05-28] ops | Fix skills indisponíveis do coordenador
- Updated: 2026-05-28-fix-skills-indisponiveis-coordenador

## [2026-05-28] ops | Setup tentáculos de conhecimento e oráculos
- Updated: 2026-05-28-setup-tentaculos-conhecimento

## [2026-05-28] ops | Reset tentáculos coordenação/conhecimento
- Updated: 2026-05-28-reset-tentaculos-coordenacao-conhecimento

## [2026-05-28] ops | Topologia coordenação/conhecimento/oráculos ajustada
- Updated: 2026-05-28-topologia-orquestradores-oraculos-ajustada

## [2026-05-28] ops | Swarm coordenador-raiz sem artefatos de merge
- Updated: 2026-05-28-swarm-coordenador-raiz-sem-artefatos

## [2026-05-28] ops | Política de aceite de swarm do coordenador-raiz
- Updated: 2026-05-28-swarm-acceptance-policy-coordenador-raiz

## [2026-05-28] ops | Diagnóstico botão Add Tentacle Manually
- Updated: 2026-05-28-diagnostico-ui-add-tentacle-manual

## [2026-05-28] ops | Fix UI Add Tentacle Manually no estado populated
- Updated: 2026-05-28-fix-ui-add-tentacle-manual-populated-state

## [2026-05-28] ops | Fix final Add Tentacle Manually em detail mode
- Updated: 2026-05-28-fix-ui-add-tentacle-manual-detail-mode

## [2026-05-28] ops | Update SWARM_ACCEPTANCE coordenador-raiz
- Updated: 2026-05-28-update-swarm-acceptance-coordenador-raiz

## [2026-05-28] ops | Instalação de skills sugeridas com aliases
- Updated: 2026-05-28-install-suggested-skills-aliases

## [2026-05-28] ops | Sync global de skills solicitadas
- Updated: 2026-05-28-global-skills-sync-awesome-index
- Scope: skills globais (`~/.codex/skills`) para disponibilidade por nome exato
- Evidence:
  - ~/.codex/skills/senior-frontend/SKILL.md
  - ~/.codex/skills/debugger/SKILL.md
  - ~/.codex/skills/bug-fix/SKILL.md
  - ~/.codex/skills/test-writer-fixer/SKILL.md
  - ~/.codex/skills/git-pushing/SKILL.md

## [2026-05-28] ops | Atualização de contexto do dev-ead-core
- Updated: 2026-05-28-dev-ead-core-context-update
- Scope: `.octogent/tentacles/dev-ead-core/CONTEXT.md`
- Evidence:
  - .octogent/tentacles/dev-ead-core/CONTEXT.md

## [2026-05-28] ops | Fix header CONTEXT dev-ead-core
- Updated: 2026-05-28-dev-ead-core-context-header-fix
- Scope: `.octogent/tentacles/dev-ead-core/CONTEXT.md`
- Evidence:
  - .octogent/tentacles/dev-ead-core/CONTEXT.md

## [2026-05-28] ops | Instalação de skills firecrawl/web-search/copywriting
- Updated: 2026-05-28-install-skills-firecrawl-websearch-copywriting
- Scope: global `~/.codex/skills` e local `.claude/skills`
- Evidence:
  - ~/.codex/skills/mcp-firecrawl/SKILL.md
  - ~/.codex/skills/browser-automation/SKILL.md
  - ~/.codex/skills/web-search/SKILL.md
  - ~/.codex/skills/copywriting-frameworks/SKILL.md
  - .claude/skills/mcp-firecrawl/SKILL.md
  - .claude/skills/browser-automation/SKILL.md
  - .claude/skills/web-search/SKILL.md
  - .claude/skills/copywriting-frameworks/SKILL.md

## [2026-05-28] ops | Verificação de handshake MCP Firecrawl
- Updated: 2026-05-28-firecrawl-mcp-handshake-check
- Scope: checagem operacional de disponibilidade MCP/API
- Evidence:
  - ~/.codex/config.toml (entrada `mcp_servers.firecrawl`)
  - timeout 5s npx -y firecrawl-mcp (exit 124 esperado)
  - curl /v1/scrape (HTTP 200)

## [2026-05-28] ops | Backlog do tentáculo roteirista-ead
- Updated: 2026-05-28-roteirista-ead-backlog-update
- Scope: `.octogent/tentacles/ROTEIRISTA-EAD/todo.md`
- Evidence:
  - .octogent/tentacles/ROTEIRISTA-EAD/todo.md

## [2026-05-28] ops | Configuração de credenciais Skilljar no .env
- Updated: 2026-05-28-env-skilljar-credentials
- Scope: `.env`
- Evidence:
  - .env (SKILLJAR_URL, SKILLJAR_EMAIL, SKILLJAR_PASSWORD)

## [2026-05-28] ops | Atualização de credenciais Skilljar no .env
- Updated: 2026-05-28-env-skilljar-credentials-rotation
- Scope: `.env`
- Evidence:
  - .env (SKILLJAR_EMAIL, SKILLJAR_PASSWORD)

## [2026-05-28] ops | Atualização de SKILLJAR_URL
- Updated: 2026-05-28-env-skilljar-url-update
- Scope: `.env`
- Evidence:
  - .env (SKILLJAR_URL)

## [2026-05-28] ops | Delegação Aula 01 Skilljar + Teleprompter
- Updated: 2026-05-28-delegacao-aula01-skilljar-teleprompter
- Scope: reescrita de TODOs das tentacles `ROTEIRISTA-EAD` e `dev-ead-core` + inicialização imediata da `ROTEIRISTA-EAD`
- Evidence:
  - .octogent/tentacles/ROTEIRISTA-EAD/todo.md
  - .octogent/tentacles/dev-ead-core/todo.md
  - wiki/knowledge-management/2026-05-28-delegacao-aula01-skilljar-teleprompter.md
  - octogent terminal create --name roteirista-ead-run-01 --tentacle-id ROTEIRISTA-EAD
  - octogent channel send terminal-2 "EXECUCAO IMEDIATA ..."


## [2026-05-28] roteirista-ead | Correção com raspagem real Skilljar (Aula 01)
- Updated: 2026-05-28-aula01-raspagem-real-skilljar
- Scope: limpeza de artefatos inferidos, raspagem real autenticada e regeneração restrita do roteiro
- Evidence:
  - apps/content/aulas/raspagem_bruta.txt
  - apps/content/aulas/aula-01.json
  - wiki/knowledge-management/2026-05-28-aula01-raspagem-real-skilljar.md

## [2026-05-28] ops | Persona professor + protocolo no roteirista
- Updated: 2026-05-28-persona-professor-e-protocolo-roteirista
- Scope:
  - wiki/knowledge-management/persona_professor.md
  - .octogent/tentacles/ROTEIRISTA-EAD/CONTEXT.md
- Evidence:
  - wiki/knowledge-management/persona_professor.md
  - .octogent/tentacles/ROTEIRISTA-EAD/CONTEXT.md

## [2026-05-28] roteirista-ead | Reescrita Aula 01 com persona do professor
- Updated: 2026-05-28-aula01-persona-professor-aplicada
- Scope: reescrita integral do roteiro com tom formal/satirico e CTAs gamificados
- Evidence:
  - apps/content/aulas/raspagem_bruta.txt
  - apps/content/aulas/aula-01.json
  - wiki/knowledge-management/persona_professor.md
  - wiki/knowledge-management/2026-05-28-aula01-persona-professor-aplicada.md

## [2026-05-28] roteirista-ead | Auditoria final: criacao Aula 01 Skilljar
- Updated: 2026-05-28-roteirista-ead-auditoria-skilljar-conclusao
- Scope: reconciliacao do backlog `ROTEIRISTA-EAD` com evidencias versionadas da criacao/execucao da Aula 01
- Evidence:
  - .octogent/tentacles/ROTEIRISTA-EAD/todo.md
  - apps/content/aulas/aula-01.json
  - apps/content/aulas/raspagem_bruta.txt
  - wiki/knowledge-management/2026-05-28-aula01-raspagem-real-skilljar.md
  - wiki/knowledge-management/2026-05-28-roteirista-ead-auditoria-skilljar-conclusao.md

## [2026-05-28] dev-ead-core | Teleprompter Next.js integrado ao Aula 01 + WS
- Updated: 2026-05-28-dev-ead-core-teleprompter-start
- Scope: implementacao/robustez do teleprompter em Next.js com `aula-01.json` como fonte de verdade e integracao com websocket existente
- Evidence:
  - apps/web/src/lib/aula01.ts
  - apps/web/src/components/teleprompter/teleprompter-view.tsx
  - apps/web/src/app/(plataforma)/professor/teleprompter/page.tsx
  - wiki/knowledge-management/2026-05-28-dev-ead-core-teleprompter-start.md

## [2026-05-28] dev-ead-core | Validação final do teleprompter
- Updated: 2026-05-28-dev-ead-core-validation-build
- Scope: fechamento do último checkbox de validação em `.octogent/tentacles/dev-ead-core/todo.md` e registro da evidência de build no wiki
- Evidence:
  - .octogent/tentacles/dev-ead-core/todo.md
  - wiki/knowledge-management/2026-05-28-dev-ead-core-validation-build.md
  - npm run build

## [2026-05-28] ops | Run local web + ws-server
- Updated: 2026-05-28-run-local-web-ws
- Scope:
  - apps/ws-server/.env
  - execução local de apps/web e apps/ws-server
- Evidence:
  - apps/ws-server/.env (PORT=3001)
  - HTTP 200 em 3000 e 3001

## [2026-05-28] feat | Câmera arrastável no painel do professor
- Updated: 2026-05-28-professor-camera-draggable
- Scope: `apps/ws-server/public/professor.html`
- Evidence:
  - apps/ws-server/public/professor.html

## [2026-05-28] ops | Rebuild local sem Docker
- Updated: 2026-05-28-rebuild-local-sem-docker
- Scope: build/restart local
- Evidence:
  - npm run build (ok)
  - HTTP 200 em 3000 e 3001

---
source: session
collected: 2026-05-28
published: 2026-05-28
---

# Migração para Monorepo: Next.js 16 + Oracle Always Free

## Contexto

Plataforma Zatto Escola estava em HTML puro (Express + ws + SQLite). Arquivos aluno.html (1718 linhas) e professor.html (1372 linhas) atingiram o limite de manutenibilidade. Decisão: migrar para Next.js 16 em monorepo com ws-server separado, deploy no Oracle Always Free com Caddy.

## Decisões de Stack

- **Next.js 16** App Router + TypeScript + Tailwind + shadcn/ui
- **@clerk/nextjs** — integração nativa, substitui guards manuais no server.js
- **ws-server separado** — custom server do Next desabilita otimizações (ISR, middleware edge); manter Express+ws isolado é mais limpo
- **SQLite mantido** — better-sqlite3, volume Docker compartilhado entre containers
- **Oracle Always Free** (Ampere ARM, 4 OCPUs, 24 GB RAM) + Caddy (SSL automático Let's Encrypt)
- **Monorepo npm workspaces** — docker compose único levanta tudo

## Estrutura do Monorepo

```
/
├── apps/
│   ├── ws-server/           Express + WebSocket + SQLite (servidor atual)
│   └── web/                 Next.js 16 (frontend em migração)
├── docker-compose.yml       ws-server:3001 + web:3000 + healthcheck
├── Caddyfile                reverse proxy + SSL
└── package.json             workspaces
```

## Roteamento no Caddyfile

- `/api/admin*`, `/api/content*`, `/api/platform*`, `/ws*` → ws-server:3000
- Todo o resto → web:3000

## Lições de Next.js 16

- `middleware.ts` foi renomeado para `proxy.ts` — warning no build se usar nome antigo
- `output: "standalone"` necessário para Dockerfile multi-stage funcionar corretamente
- `ClerkProvider` vai no layout raiz; `proxy.ts` usa `clerkMiddleware` + `createRouteMatcher`
- Auth pages: Clerk nativo com `<SignIn />` e `<SignUp />` em route groups `(auth)`

## Vulnerabilidades Corrigidas

- express 4.22.1 → 4.22.2 (qs DoS)
- ws 8.20.0 → 8.21.0 (memory disclosure)
- Resultado: 0 vulnerabilidades (era 5)

## Migration duplicada corrigida

`002_aula_respostas.sql` renomeado para `003_aula_respostas.sql` — duas migrations começavam com `002_`, a ordem de aplicação dependia de sort alfabético, frágil.

## Variáveis de Ambiente

- `WS_SERVER_INTERNAL_URL` — URL interna server-side para Next.js chamar ws-server (ex: `http://ws-server:3000`)
- `NEXT_PUBLIC_WS_URL` — URL pública WebSocket para o cliente (ex: `wss://cursos.s-iron.tech/ws`)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — var pública Clerk para Next.js

## Fases do Plano de Migração

- Fase 0: Oracle + CI/CD + ws-server atual em prod
- Fase 1: Setup Next.js (concluído)
- Fase 2: Route Handlers + hooks WS/WebRTC
- Fase 3: Páginas (admin de conteúdo → professor → aluno)
- Fase 4: Features novas (gamificação, dashboards, relatórios)

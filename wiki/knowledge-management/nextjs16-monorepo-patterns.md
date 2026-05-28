---
title: Next.js 16 + Monorepo — Padrões e Armadilhas
sources: Sessão de migração Zatto Escola; 2026-05-28
raw: ../../raw/knowledge-management/2026-05-28-monorepo-nextjs16-oracle-migration.md
updated: 2026-05-28
---

# Next.js 16 + Monorepo — Padrões e Armadilhas

## Breaking Change: middleware.ts → proxy.ts

Next.js 16 renomeou a convenção de arquivo. Se usar `middleware.ts`, o build compila mas emite warning e o arquivo pode ser ignorado silenciosamente em versões futuras. **Sempre usar `proxy.ts`** no Next.js 16+.

```
src/proxy.ts     ✅ Next.js 16
src/middleware.ts ⚠️  deprecated — warning no build
```

## Clerk no Next.js 16

```ts
// src/proxy.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();
  await auth.protect();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

Páginas de auth via route groups `(auth)` com Clerk nativo — zero código customizado:

```
src/app/(auth)/sign-in/[[...sign-in]]/page.tsx  → <SignIn />
src/app/(auth)/sign-up/[[...sign-up]]/page.tsx  → <SignUp />
```

## Dockerfile multi-stage com standalone

Exige `output: "standalone"` no `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "standalone",
};
```

Sem isso, o `CMD ["node", "server.js"]` no container não funciona — o `server.js` do standalone não existe.

## Monorepo npm workspaces + Docker separado

Estrutura recomendada para ws-server (Node) + web (Next.js) no mesmo repo:

```
/package.json          → workspaces: ["apps/*"]
apps/ws-server/        → Express + ws + SQLite
apps/web/              → Next.js 16
docker-compose.yml     → levanta ambos
```

Cada `apps/*/Dockerfile` faz seu próprio `npm ci` — não depende do `node_modules` raiz do workspace. Isso simplifica o build Docker (cada app é autossuficiente no contexto de build).

## Variáveis de Ambiente: separar server-side de public

```env
# Apenas server-side (Next.js Route Handlers, Server Components)
WS_SERVER_INTERNAL_URL=http://ws-server:3000

# Exposta ao cliente (bundle JS)
NEXT_PUBLIC_WS_URL=wss://cursos.s-iron.tech/ws
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
```

Regra: qualquer var prefixada com `NEXT_PUBLIC_` vai para o bundle do cliente. Nunca colocar secrets com esse prefixo.

## Caddyfile: proxy WebSocket + rotas split

```
cursos.s-iron.tech {
    handle /ws* {
        reverse_proxy ws-server:3000 {
            header_up Host {host}
        }
    }
    handle /api/admin* { reverse_proxy ws-server:3000 }
    handle /api/content* { reverse_proxy ws-server:3000 }
    # ... outras rotas do ws-server
    handle {
        reverse_proxy web:3000
    }
}
```

Caddy faz upgrade automático de HTTP→WebSocket quando o header `Upgrade: websocket` está presente.

## Quando NÃO usar Custom Server no Next.js

Custom server (`server.js` substituindo o `next start`) desabilita:
- ISR (Incremental Static Regeneration)
- Edge middleware
- Algumas otimizações de prefetch

Para WS persistente, manter servidor Node separado e fazer proxy via Caddy/nginx é preferível a embeddar o WS no custom server do Next.

## See Also

- [Clerk Auth Flow — Roles e Roteamento](clerk-auth-flow.md)
- [WebSocket — Padrões e Armadilhas](websocket-patterns-e-armadilhas.md)
- [Node.js Backend — Padrões de Segurança](nodejs-security-patterns.md)

# Clerk Auth Flow — Roles e Roteamento

> Sources: Debugging interno da plataforma, 2026-05-14
> Raw: [Clerk Auth Flow — Deadlock e Solução](../../raw/knowledge-management/2026-05-14-clerk-auth-flow.md)

## Overview

Padrão de autenticação com Clerk + sistema de roles em banco de dados. O ponto crítico é a fase pós-login: o usuário está autenticado no Clerk mas ainda não tem role na aplicação — esse gap causa deadlock se não tratado.

## Arquitetura de Roles

```
Clerk (identidade)  →  platform_users (role na app)
clerk_user_id            role: root | professor | aluno
email                    status: active | inactive
```

O Clerk gerencia identidade (senha, OAuth, MFA). A aplicação gerencia autorização (quem pode ver o quê). São sistemas separados que se conectam via `clerk_user_id`.

## Fluxo Correto Pós-Login

```
/ (index)
  └─ "Acessar plataforma" → /auth/sign-in.html
        └─ afterSignInUrl: /auth/redirect.html
              └─ GET /api/platform/me
                    └─ role=root      → /platform-admin.html
                    └─ role=professor → /professor.html
                    └─ role=aluno     → /aluno.html
                    └─ sem role       → /
```

**Regras:**
- Nunca redirecionar pós-login direto para página com role-guard — sempre passar por `/auth/redirect.html`
- `redirect.html` nunca usa `redirect_url` passthrough — sempre roteia pelo role real da API
- `index.html` não expõe links admin nem separação de perfil — um único botão de entrada
- Se já logado, `hydrate()` no index troca o botão para link direto da página do role

## Auto-Bootstrap Root

Quando o email do usuário Clerk está em `PLATFORM_ROOT_EMAILS`, o middleware `requirePlatformRolePage('root')` promove automaticamente para root na primeira visita:

```js
if (role === 'root' && (!user || user.role !== 'root')) {
  const clerkUser = await clerkClient.users.getUser(auth.userId);
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  const rootEmails = (process.env.PLATFORM_ROOT_EMAILS || '')
    .split(',').map(e => e.toLowerCase().trim()).filter(Boolean);
  if (rootEmails.includes(email)) {
    // promove para root no banco
  }
}
```

Elimina o chicken-and-egg: para ser root precisa acessar a página, para acessar precisa ser root.

## Hierarquia de Convites

```
root  → convida professor  (POST /api/platform/invite/professor)
professor → convida aluno  (POST /api/platform/invite/aluno)
qualquer  → aceita convite (POST /api/platform/invite/accept)
```

Cada convite gera um token de 48 chars hex, válido por 7 dias. O link de convite aponta para `/auth/sign-up.html?invite=TOKEN&role=ROLE`.

## Env Vars Necessárias

| Var | Descrição |
|-----|-----------|
| `CLERK_SECRET_KEY` | Chave secreta — nunca expor |
| `CLERK_PUBLISHABLE_KEY` | Chave pública — pode estar no frontend (by design) |
| `CLERK_FRONTEND_API_URL` | URL do frontend API do Clerk |
| `PLATFORM_ROOT_EMAILS` | Emails separados por vírgula que viram root automaticamente |

## 403 Amigável

Páginas com role-guard retornam HTML explicativo ao invés de texto cru, indicando qual role é necessário e link de volta.

## See Also

- [Node.js Backend — Padrões de Segurança](nodejs-security-patterns.md)
- [WebSocket — Padrões e Armadilhas](websocket-patterns-e-armadilhas.md)

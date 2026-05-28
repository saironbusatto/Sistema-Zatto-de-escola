# Clerk Auth Flow — Deadlock e Solução

> Source: Debugging do sistema de autenticação Clerk + roles da plataforma
> Collected: 2026-05-14
> Published: 2026-05-14

## O Deadlock

Fluxo com bug:
1. Usuário acessa `/platform-admin.html`
2. `requireClerkAuthPage` → redireciona para `/auth/sign-in.html?redirect_url=/platform-admin.html`
3. Usuário faz login no Clerk → Clerk redireciona para `/platform-admin.html`
4. `requirePlatformRolePage('root')` → consulta `platform_users` → usuário não existe lá → **403**
5. Usuário nunca consegue chamar o endpoint de bootstrap porque a página está bloqueada

É um chicken-and-egg: para acessar a página precisa de role, para ter role precisa acessar a página.

## Solução: três partes

### 1. Auto-bootstrap no middleware
`requirePlatformRolePage` agora detecta se o email Clerk do usuário está em `PLATFORM_ROOT_EMAILS` e promove automaticamente para root antes de checar o role:

```js
if (role === 'root' && (!user || user.role !== 'root')) {
  const clerkUser = await clerkClient.users.getUser(auth.userId);
  const email = clerkUser?.emailAddresses?.[0]?.emailAddress?.toLowerCase();
  const rootEmails = process.env.PLATFORM_ROOT_EMAILS.split(',').map(e => e.trim().toLowerCase());
  if (rootEmails.includes(email)) {
    // INSERT ou UPDATE para role='root'
    user = db.prepare('SELECT * FROM platform_users WHERE clerk_user_id = ?').get(auth.userId);
  }
}
```

### 2. Página de roteamento pós-login (`/auth/redirect.html`)
Após o login, o Clerk redireciona para essa página intermediária que:
1. Chama `/api/platform/me` 
2. Lê o `role` retornado
3. Encaminha para a página correta: root→`/platform-admin.html`, professor→`/professor.html`, aluno→`/aluno.html`

Evita que o usuário caia direto na página que pode estar bloqueada.

### 3. 403 amigável
Substituiu o `res.status(403).send('Acesso negado para este perfil.')` por HTML explicativo com o role esperado e link de volta.

## Lição
Fluxos de autenticação com roles precisam de uma página de roteamento intermediária pós-login. Nunca redirecionar direto para páginas com role-guard sem antes verificar e preparar o estado do usuário.

## Env vars necessárias
- `PLATFORM_ROOT_EMAILS` — lista separada por vírgula dos emails que viram root automaticamente
- `CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`, `CLERK_FRONTEND_API_URL` — credenciais Clerk

# 2026-05-28 — Octogent com provider padrão em Codex

## O que mudou
- Alterado no código-fonte do Octogent: `DEFAULT_AGENT_PROVIDER` de `claude-code` para `codex`.
  - Arquivo: `/home/saironbusatto/PROJETOS/Octoagent/octogent/apps/api/src/terminalRuntime/constants.ts`
- Rebuild do Octogent executado com sucesso.
- Pacote atualizado e reinstalado globalmente via `npm install -g /tmp/octogent-0.1.0.tgz`.

## Por que mudou
- Usuário solicitou que, ao iniciar o Octogent, o provider padrão seja Codex em vez de Claude Code.

## Evidências de validação
- Build concluído com sucesso (`pnpm build`).
- Binário global do Octogent aponta para `dist/api/cli-Lnh-XN5s.js`.
- Bundle global atualizado contém `DEFAULT_AGENT_PROVIDER = "codex"` em:
  - `/home/saironbusatto/.var/app/com.visualstudio.code/data/node_modules/lib/node_modules/octogent/dist/api/createApiServer-BTN3yQw1.js`
- API local respondeu normalmente em `http://127.0.0.1:8787/api/setup` após atualização.

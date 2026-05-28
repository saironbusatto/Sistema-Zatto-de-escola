# 2026-05-28 — Execução local web + ws-server

## O que mudou
- Subido `apps/web` em modo dev (`next dev`) na porta `3000`.
- Ajustado `apps/ws-server/.env` para evitar conflito de porta com o web app:
  - `PORT="3001"`
- Subido `apps/ws-server` em modo dev (`nodemon server.js`) na porta `3001`.

## Por que mudou
- Permitir rodar frontend e backend em tempo real simultaneamente no ambiente local sem `EADDRINUSE`.

## Evidências de validação
- Logs do web app indicam `Local: http://localhost:3000`.
- Logs do ws-server indicam `Plataforma rodando em http://localhost:3001`.
- Health-check HTTP:
  - `http://127.0.0.1:3000 -> 200`
  - `http://127.0.0.1:3001 -> 200`

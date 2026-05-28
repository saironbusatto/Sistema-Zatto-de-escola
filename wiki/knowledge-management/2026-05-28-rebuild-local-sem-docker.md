# 2026-05-28 — Rebuild local sem Docker

## O que mudou
- Tentativa de rebuild via Docker Compose bloqueada (Docker indisponível no ambiente).
- Rebuild realizado via `npm run build` (app web).
- Serviços locais revalidados em execução.

## Por que mudou
- Permitir teste local imediato mesmo sem engine Docker instalada.

## Evidências de validação
- Build concluído com sucesso (`next build`).
- Health-check:
  - `http://127.0.0.1:3000 -> 200`
  - `http://127.0.0.1:3001 -> 200`

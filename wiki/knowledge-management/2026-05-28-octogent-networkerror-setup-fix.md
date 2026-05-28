# 2026-05-28 — Fix do NetworkError no Workspace Setup

## O que mudou
- Octogent reiniciado em modo daemon estável com `setsid` e `stdin` fechado.
- Processo fixado com `PPID=1` para não cair ao encerrar terminal.

## Por que mudou
- O erro `NetworkError when attempting to fetch resource` ocorria porque o backend local em `127.0.0.1:8787` não permanecia ativo.

## Evidências de validação
- Processo ativo: `node .../octogent` com `PPID=1`.
- `GET /api/setup` respondeu JSON de setup consistentemente.
- `POST /api/setup/steps/initialize-workspace` respondeu com sucesso.
- Snapshot de setup retornou passo `initialize-workspace` com `complete: true`.

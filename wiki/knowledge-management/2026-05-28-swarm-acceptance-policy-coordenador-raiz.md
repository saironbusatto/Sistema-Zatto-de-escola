# 2026-05-28 — Política de aceite de swarm do coordenador-raiz

## O que mudou
- Criado `.octogent/tentacles/coordenador-raiz/SWARM_ACCEPTANCE.md`.
- Definido contrato de `DONE` com evidência obrigatória (`branch`, `commit`, `evidence`).
- Definidos checklists de validação por worker e integração final.

## Por que mudou
- Evitar repetição de `DONE` sem artefato persistido (branch/worktree/commit) e reduzir drift operacional.

## Evidências de validação
- Arquivo criado: `.octogent/tentacles/coordenador-raiz/SWARM_ACCEPTANCE.md`.
- Conteúdo inclui:
  - regra de aceite obrigatória
  - comandos de validação (`git branch`, `git log`, `git diff`)
  - fluxo de integração e critérios de bloqueio

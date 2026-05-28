# 2026-05-28 — Fix de skills indisponíveis no coordenador-raiz

## O que mudou
- Criado diretório local `.claude/skills/` no projeto.
- Copiadas as skills referenciadas no tentáculo `coordenador-raiz` para o projeto:
  - `architecture`
  - `architecture-decision-records`
  - `business-analyst`
  - `context-manager`
  - `executing-plans`
  - `feature-planning`

## Por que mudou
- A UI mostrava “Stored on this tentacle, but not available right now”.
- Diagnóstico: skills referenciadas no `CONTEXT.md` não existiam localmente em `.claude/skills/`.

## Evidências de validação
- Presença dos arquivos `SKILL.md` nas 6 skills em `.claude/skills/`.
- API do Octogent responde normalmente em `http://127.0.0.1:8787/api/setup` após ajuste.

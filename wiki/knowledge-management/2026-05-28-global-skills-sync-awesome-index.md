# 2026-05-28 — Sync global de skills solicitadas

## O que mudou
- Verificado o índice `ComposioHQ/awesome-claude-skills` para as skills solicitadas:
  - `senior-frontend`
  - `debugger`
  - `bug-fix`
  - `test-writer-fixer`
  - `git-pushing`
- Constatado que o repositório funciona como índice e não contém todas essas skills como diretórios locais.
- Garantida instalação global em `~/.codex/skills` com nomes exatos pedidos.
- Criados aliases globais para nomes ausentes:
  - `senior-frontend` (base: `frontend-developer`)
  - `bug-fix` (base: `systematic-debugging`)
  - `test-writer-fixer` (base: `test-fixing`)

## Por que mudou
- Evitar falhas de resolução de skill por nome exato no Octogent/Claude Skills loader.
- Padronizar disponibilidade no repositório global de skills para uso futuro em qualquer projeto.

## Evidências de validação
- Consulta no índice:
  - `git clone --depth 1 https://github.com/ComposioHQ/awesome-claude-skills.git`
  - Busca por entradas das skills no `README.md` e diretórios `*/SKILL.md`.
- Verificação final local:
  - `~/.codex/skills/senior-frontend/SKILL.md`
  - `~/.codex/skills/debugger/SKILL.md`
  - `~/.codex/skills/bug-fix/SKILL.md`
  - `~/.codex/skills/test-writer-fixer/SKILL.md`
  - `~/.codex/skills/git-pushing/SKILL.md`

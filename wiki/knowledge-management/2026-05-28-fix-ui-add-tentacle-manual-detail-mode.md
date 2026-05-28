# 2026-05-28 — Fix final UI: Add Tentacle Manually abre em detail mode

## O que mudou
- Ajustado `DeckPrimaryView` para abrir o formulário de criação manual no painel principal (detail mode) quando `emptyViewMode === "adding"`, inclusive com tentáculos existentes.
- Ajustado cálculo de `mode` para considerar `emptyViewMode === "adding"`.
- Rebuild e reinstalação global do Octogent.

## Por que mudou
- Mesmo após patch inicial na sidebar, o clique podia parecer inoperante porque o painel principal permanecia em `grid` (detalhe oculto por CSS) e a renderização do formulário ficava pouco evidente no layout.

## Evidências de validação
- Bundle web novo gerado: `index-Ba7wH3f0.js`.
- Serviço do projeto servindo o hash novo no `GET /`.
- Assets globais atualizados no pacote global do Octogent.

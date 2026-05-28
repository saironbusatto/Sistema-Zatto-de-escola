# 2026-05-28 — Diagnóstico: botão "Add Tentacle Manually" não aparece

## O que mudou
- Nenhuma alteração de código foi aplicada.
- Foi realizado diagnóstico de comportamento da UI do Octogent e teste direto dos endpoints.

## Por que acontece
- No `DeckPrimaryView`, o bloco `ActionCards` (que contém "Add Tentacle Manually") só é renderizado quando `tentacles.length === 0`.
- Com pelo menos 1 tentáculo existente, a UI entra no estado "populated" e não mostra esse card.

## Evidências de validação
- Endpoint de listagem retornou tentáculo existente (`coordenador-raiz`): `GET /api/deck/tentacles`.
- Endpoint de criação manual está saudável: `POST /api/deck/tentacles` criou `manual-test` com sucesso.
- Implementação confirmada em:
  - `apps/web/src/components/DeckPrimaryView.tsx` (render de empty state condicionado a `tentacles.length === 0`)
  - `apps/web/src/components/deck/ActionCards.tsx` (onde está o botão "Add Tentacle Manually").

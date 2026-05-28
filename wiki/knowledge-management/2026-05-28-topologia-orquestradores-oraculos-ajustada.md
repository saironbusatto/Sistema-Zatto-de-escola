# 2026-05-28 — Topologia de coordenação, conhecimento e oráculos ajustada

## O que mudou
- Ajustados/reescritos os tentáculos:
  - `coordenador-raiz`
  - `orquestrador-conhecimento`
  - `escrivao-oraculo`
  - `interprete-de-contexto-raiz`
- Garantidos papéis e limites:
  - `coordenador-raiz` = pai estratégico
  - `orquestrador-conhecimento` = pai estratégico paralelo
  - `escrivao-oraculo` = oráculo de observação
  - `interprete-de-contexto-raiz` = oráculo de síntese

## Por que mudou
- Solicitação explícita para remover hierarquia incorreta, separar responsabilidades e evitar contexto transitório em `CONTEXT.md`.

## Evidências de validação
- Estrutura final de arquivos confirmada para os 4 tentáculos (`CONTEXT.md` e `todo.md`).
- Verificação textual dos pontos-chave nos contextos:
  - `orquestrador-conhecimento` no mesmo nível e não subordinado
  - `escrivao-oraculo` registra fatos e não decide estratégia
  - `interprete-de-contexto-raiz` interpreta/sintetiza e não executa
  - cruzamento obrigatório de wiki, código e git
  - separação explícita entre fato, hipótese, risco e recomendação

# 2026-05-28 — Ordem de dependência dos orquestradores no coordenador-raiz

## O que mudou
- Atualizado `.octogent/tentacles/coordenador-raiz/CONTEXT.md` com nova seção de ordem de dependência entre orquestradores.
- Definido `orquestrador-conhecimento` como trilha transversal contínua, em paralelo leve.

## Por que mudou
- Ajustar a priorização para refletir dependências reais do projeto (base estrutural → dados → web → conteúdo), mantendo conhecimento como suporte contínuo.

## Evidências de validação
- Seção adicionada no arquivo com os blocos:
  - `## Ordem de dependência entre orquestradores`
  - `### Trilha transversal`
- Verificação textual por busca no arquivo (`rg`).

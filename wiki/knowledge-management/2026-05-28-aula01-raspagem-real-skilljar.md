# Aula 01: Raspagem real do Skilljar e regeneracao do roteiro

Data: 2026-05-28  
Responsavel: roteirista-ead

## O que mudou
- Removidos artefatos invalidos anteriores:
  - `apps/content/aulas/aula-01.json` (versao inferida)
  - `wiki/knowledge-management/2026-05-28-aula01-roteiro-teleprompter-claude101.md`
- Executada raspagem real autenticada da pagina `https://anthropic.skilljar.com/claude-101` com credenciais vindas de `.env`.
- Criado `apps/content/aulas/raspagem_bruta.txt` com o texto bruto extraido da pagina.
- Recriado `apps/content/aulas/aula-01.json` exclusivamente a partir de `raspagem_bruta.txt`.

## Por que mudou
- Correcao de integridade: o roteiro nao poderia ser baseado em inferencia.
- O fluxo correto exige fonte rastreavel e artefato bruto verificavel antes da roteirizacao.

## Evidencias de validacao
- `node apps/content/aulas/.skilljar_scrape.mjs` => `SCRAPE_OK`
- Presenca de fonte bruta:
  - `apps/content/aulas/raspagem_bruta.txt`
- JSON recriado com referencia explicita da fonte obrigatoria:
  - `apps/content/aulas/aula-01.json`

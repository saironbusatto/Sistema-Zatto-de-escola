# DEV-EAD-CORE: Teleprompter (Aula 01 JSON como fonte de verdade)

## O que mudou
- Reforco de validacao do loader da Aula 01 em `apps/web/src/lib/aula01.ts`:
  - validacao de estrutura completa (`meta`, `topicos_origem`, `blocos` e campos obrigatorios);
  - retorno `null` para JSON ausente, invalido ou fora de schema.
- Atualizacao do componente em `apps/web/src/components/teleprompter/teleprompter-view.tsx`:
  - renderizacao dos blocos principais a partir de `aula-01.json`;
  - lateral com CTA do bloco + lembretes (`topicos_origem`) + base de raspagem;
  - sincronizacao websocket bidirecional:
    - recebe `state_update.blocoLiberado` e atualiza navegacao;
    - envia `liberar_bloco` ao navegar (anterior/proximo), integrando com estado global existente.
  - tratamento de `blocoLiberado = -1` (estado inicial do servidor), iniciando no primeiro bloco.
- Pagina Next.js de teleprompter manteve fallback de erro para JSON ausente/invalido em `apps/web/src/app/(plataforma)/professor/teleprompter/page.tsx`.

## Por que mudou
- Atender ao requisito de usar `apps/content/aulas/aula-01.json` como fonte de verdade do teleprompter.
- Garantir consistencia com o contrato websocket ja implementado no `ws-server` (`professor_connect`, `state_update`, `liberar_bloco`).
- Melhorar robustez para cenarios de arquivo ausente, JSON invalido e shape incorreto.

## Evidencias de validacao
- `npm --workspace=apps/web run lint`:
  - passou sem erros; warning pre-existente em `apps/web/src/app/page.tsx` (`currentUser` nao usado).
- `npm run build`:
  - build do Next.js concluido com sucesso;
  - rota `/professor/teleprompter` gerada.
- `npm --workspace=apps/web run test`:
  - falhou por inexistencia de script `test` no workspace `apps/web`.

## Caminhos alterados
- `apps/web/src/lib/aula01.ts`
- `apps/web/src/components/teleprompter/teleprompter-view.tsx`
- `wiki/knowledge-management/2026-05-28-dev-ead-core-teleprompter-start.md`
- `wiki/log.md`

# DEV-EAD-CORE | Validação do teleprompter

## O que mudou
- O item pendente de validação do `dev-ead-core` foi fechado no backlog da tentacle.
- Foi adicionada evidência operacional da validação do teleprompter baseado em `apps/content/aulas/aula-01.json`.

## Por que mudou
- O único checkbox aberto era a evidência de validação. Sem esse fechamento, a tentacle não podia ser considerada concluída.

## Evidência de validação
- Comando executado: `npm run build`
- Resultado: build concluído com sucesso.
- O output do build incluiu a rota `/professor/teleprompter`, confirmando a integração da página.

# TODO — ROTEIRISTA-EAD

## Missão (prioridade máxima)
Criar a primeira aula no Anthropic Skilljar e exportar o roteiro validado para o teleprompter.

## Contexto da Aula para Criação
- URL alvo: `https://anthropic.skilljar.com/claude-101`
- Tema da Aula 01: `Claude 101`
- Tópicos principais: `Meet Claude, fundamentos, projetos, artifacts, skills, tools, privacy`

## Execução obrigatória
- [x] Usar automação para acessar a URL alvo do Skilljar.
- [x] Fazer login usando **exclusivamente** credenciais carregadas das variáveis de ambiente no `.env`:
  - `SKILLJAR_EMAIL`
  - `SKILLJAR_PASSWORD`
- [x] Não usar credencial hardcoded, arquivo alternativo, ou input manual fora dessas variáveis.
- [x] Criar a `Aula 01` no Skilljar com base no tema e tópicos acima. Evidência reconciliada via raspagem autenticada e artefatos versionados.
- [x] Desenvolver ganchos de copy e CTAs para condução da aula.
- [x] Exportar roteiro final validado em JSON para: `apps/content/aulas/aula-01.json`.

## Critérios mínimos do JSON (`aula-01.json`)
- [x] Estrutura com blocos/slides da aula.
- [x] CTAs do professor em pontos estratégicos.
- [x] Lembretes operacionais para fala/transição.
- [x] Conteúdo coerente com tema e tópicos definidos.

## Aceite obrigatório (SWARM_ACCEPTANCE)
Siga **estritamente** `.octogent/tentacles/coordenador-raiz/SWARM_ACCEPTANCE.md`.
Só responder `DONE` com os 3 itens válidos:
- `branch`
- `commit`
- `evidence` (incluindo `apps/content/aulas/aula-01.json` e quaisquer arquivos de suporte alterados)

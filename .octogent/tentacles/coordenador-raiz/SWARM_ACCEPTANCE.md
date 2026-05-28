# SWARM_ACCEPTANCE — COORDENADOR RAIZ

## Objetivo
Evitar `DONE` sem artefato versionável e eliminar drift entre canal, código e wiki.

## Regra de aceite (obrigatória)
Um worker só é considerado `DONE` quando entregar os 3 itens abaixo na mesma mensagem:
1. `branch`: nome da branch do worker (ex.: `octogent/coordenador-raiz-swarm-2`)
2. `commit`: hash do commit final
3. `evidence`: caminho do(s) arquivo(s) alterado(s), incluindo wiki quando aplicável

Formato recomendado:
```text
DONE: <item>
branch: <branch>
commit: <hash>
evidence:
- <path1>
- <path2>
```

## Checklist do coordenador antes de aceitar DONE
Para cada worker:
1. Confirmar branch existe:
```bash
git branch --list '<branch>'
```
2. Confirmar commit existe na branch:
```bash
git log --oneline <branch> -n 1
```
3. Confirmar diff contra `main`:
```bash
git diff --name-only main...<branch>
```
4. Confirmar evidência declarada bate com arquivos alterados.

Se qualquer item falhar, status do worker vira `BLOCKED` operacional.

## Checklist de integração (após todos os DONE válidos)
1. Criar branch de integração limpa:
```bash
git branch -D octogent_integration_coordenador-raiz 2>/dev/null || true
git checkout main
git checkout -b octogent_integration_coordenador-raiz
```
2. Revisar diff de cada branch antes de merge:
```bash
git log --oneline main..<branch>
git diff --stat main...<branch>
```
3. Merge sequencial das branches:
```bash
git merge <branch> --no-edit
```
4. Rodar testes obrigatórios do projeto.
5. Merge em `main` somente com testes OK.
6. Atualizar `.octogent/tentacles/coordenador-raiz/todo.md`.
7. Registrar ingest em `wiki/knowledge-management/` e entrada em `wiki/log.md`.

## Padrão de documentação
- Destino: `wiki/knowledge-management/YYYY-MM-DD-<slug>.md`
- Toda execução de swarm deve registrar:
  - o que mudou
  - por que mudou
  - evidências de validação (comandos/arquivos)

## Tratamento de falhas comuns
- `DONE` sem branch/commit: inválido; pedir reenvio no formato obrigatório.
- Branch inexistente: worker deve recriar branch e reaplicar commit.
- Worktree sumiu: tratar como incidente, não marcar `todo` até reconciliação.

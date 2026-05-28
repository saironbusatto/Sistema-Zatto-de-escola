# 2026-05-28 — Atualização do SWARM_ACCEPTANCE do coordenador-raiz

## O que mudou
- Substituído o conteúdo de `.octogent/tentacles/coordenador-raiz/SWARM_ACCEPTANCE.md`.
- Novo conteúdo inclui:
  - regra de aceite obrigatória com tripla (`branch`, `commit`, `evidence`)
  - checklist pré-aceite por worker
  - checklist de integração pós-DONE
  - higienização imediata de branch efêmera (`git branch -D <branch>`)
  - padrão de documentação em `wiki/knowledge-management/`
  - tratamento de falhas comuns

## Por que mudou
- Solicitação explícita para endurecer governança de swarm e eliminar DONE sem artefato versionável, drift e lixo de branches.

## Evidências de validação
- Arquivo alvo atualizado com sucesso:
  - `.octogent/tentacles/coordenador-raiz/SWARM_ACCEPTANCE.md`
- Validação por leitura direta do arquivo (`sed -n '1,240p'`).

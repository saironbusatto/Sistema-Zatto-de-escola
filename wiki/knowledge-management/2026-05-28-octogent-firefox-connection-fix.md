# 2026-05-28 — Correção de acesso no Firefox (127.0.0.1:8787)

## O que mudou
- Reinicializado o Octogent no projeto com `nohup octogent`.
- Atualizado PID em `.octogent.pid`.

## Por que mudou
- O processo anterior não estava ativo, causando erro "Ligação não estabelecida" no Firefox.

## Evidências de validação
- Processo ativo: `node .../octogent` com PID novo.
- `curl -I http://127.0.0.1:8787` respondeu HTTP.
- `curl http://127.0.0.1:8787` retornou HTML da UI do Octogent.
- Log confirma: `Octogent is running` em `127.0.0.1:8787`.

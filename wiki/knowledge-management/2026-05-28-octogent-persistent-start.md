# 2026-05-28 — Start persistente do Octogent

## O que mudou
- Octogent iniciado em modo desacoplado com `nohup` e `stdin` fechado.
- PID atualizado em `.octogent.pid`.

## Por que mudou
- Em tentativas anteriores o processo não se mantinha em execução entre verificações.
- Necessário manter o serviço ativo para acesso via Firefox em `127.0.0.1:8787`.

## Evidências de validação
- Processo ativo com `PPID=1` (desacoplado do shell).
- PID validado em `ps` após alguns segundos.
- Endpoint respondeu em `http://127.0.0.1:8787` (HTTP ativo).

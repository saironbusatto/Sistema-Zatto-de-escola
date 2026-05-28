# 2026-05-28 — Correção global do Octoagent

## O que mudou
- Criado wrapper global em `/home/saironbusatto/.local/bin/octogent`.
- O wrapper força `PATH` com `Node v22.22.3` e delega para o binário global real em `/home/saironbusatto/.var/app/com.visualstudio.code/data/node_modules/bin/octogent`.

## Por que mudou
- O `octogent` instalado globalmente era executado com `Node v20.20.1`, incompatível com a exigência do projeto (`Node >=22`) e com carregamento de `node-pty`.
- Objetivo: garantir funcionamento global, sem depender de caminho manual por projeto.

## Evidências de validação
- `which -a octogent` mostra precedência para `/home/saironbusatto/.local/bin/octogent`.
- `octogent --help` executa com sucesso em shell limpo.
- `octogent projects` executa com sucesso (retornou estado válido: sem projetos registrados no escopo testado).

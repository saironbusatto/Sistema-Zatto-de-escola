# 2026-05-28 — Verificação de handshake do MCP Firecrawl

## O que foi verificado
- Presença de configuração MCP do Firecrawl em `~/.codex/config.toml`:
  - seção `[mcp_servers.firecrawl]`
  - comando `npx -y firecrawl-mcp`
- Teste de inicialização do processo `firecrawl-mcp` com timeout controlado.
- Teste de conectividade da API Firecrawl com chave configurada, via endpoint `/v1/scrape`.

## Resultado
- Handshake operacional validado:
  - Processo `firecrawl-mcp` manteve execução durante a janela de teste (encerrado por timeout esperado).
  - API retornou `HTTP 200` em requisição de scrape de `https://example.com`.

## Evidências de validação
- `timeout 5s npx -y firecrawl-mcp` -> exit `124` (timeout esperado para processo de longa execução)
- `curl https://api.firecrawl.dev/v1/scrape ...` -> `HTTP 200`

# LLM Wiki Workflow

> Sources: Karpathy (gist, Unknown); Astro-Han, 2026-05-13
> Raw: [Karpathy LLM Wiki — Workflow e Filosofia](../../raw/knowledge-management/2026-05-13-karpathy-llm-wiki-workflow.md)

## Overview

O LLM Wiki é um sistema de conhecimento pessoal onde o modelo de linguagem escreve e mantém páginas estruturadas em markdown, enquanto o humano escolhe fontes e faz perguntas. O conhecimento compõe ao longo do tempo: cada nova fonte enriquece artigos existentes, fortalece referências cruzadas e registra contradições — em vez de ser descartada após uma única query.

> "The LLM writes and maintains the wiki; the human reads and asks questions."
> "The wiki is a persistent, compounding artifact." — Karpathy

## Arquitetura

Três camadas sob a raiz do projeto:

**`raw/`** — Material fonte imutável. Arquivos salvos como `raw/<tópico>/YYYY-MM-DD-slug.md`, nunca modificados após criação.

**`wiki/`** — Artigos compilados e mantidos pelo LLM. Estrutura `wiki/<tópico>/<artigo>.md`, com dois arquivos especiais:
- `wiki/index.md` — Índice global com uma linha por artigo
- `wiki/log.md` — Log append-only de todas as operações

**`SKILL.md`** — Esquema e regras do workflow (não faz parte do conteúdo do wiki).

## Três Operações

**Ingest** — Coleta uma fonte em `raw/` e compila em `wiki/`. Sempre ambos os passos. Após a compilação primária, verifica ripple effects em artigos relacionados (cascade updates). Atualiza `index.md` e appenda em `log.md`.

**Query** — Busca `wiki/index.md`, lê artigos relevantes, responde com citações linkando de volta ao markdown. Não escreve arquivos a menos que o usuário peça para arquivar a resposta.

**Lint** — Verificações em duas categorias:
- *Determinísticas (auto-fix):* consistência do índice, links internos quebrados, referências raw inválidas, See Also desatualizados.
- *Heurísticas (reportar apenas):* contradições factuais, claims desatualizados, páginas órfãs, conceitos sem artigo próprio.

## Regras de Compilação

| Situação | Ação |
|----------|------|
| Mesma tese central de artigo existente | Merge: adicionar fonte, atualizar seções afetadas |
| Conceito novo | Criar novo artigo no tópico mais relevante |
| Abrange múltiplos tópicos | Colocar no mais relevante + See Also para outros |
| Conflito com conteúdo existente | Anotar contradição com atribuição de fonte em ambos os artigos |

## LLM Wiki vs RAG

| | RAG | LLM Wiki |
|--|-----|----------|
| Conhecimento vive em | Chunks brutos + embeddings | Páginas markdown curadas |
| Síntese acontece | Na query | Durante ingest e manutenção |
| Melhor para | Recuperação ampla em corpora grandes | Conhecimento composto, resumos duráveis |

A diferença-chave: no RAG, relacionamentos são re-derivados a cada query. No LLM Wiki, são preservados e enriquecidos a cada ingest — o conhecimento **acumula**.

## Por Que Isso Funciona

Cada ingest pode atualizar múltiplas páginas simultaneamente. Artigos ficam mais ricos com o tempo. Contradições entre fontes são documentadas. O humano mantém o curadoria (escolha de fontes, perguntas certas); o LLM mantém a consistência e a síntese.

## See Also

- [Obsidian como Sistema de Gestão de Conhecimento](obsidian-pkm.md)
- [Obsidian Ferramentas Técnicas](obsidian-tools-reference.md)

# Karpathy LLM Wiki — Workflow e Filosofia

> Source: https://github.com/Astro-Han/karpathy-llm-wiki (baseado em https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
> Collected: 2026-05-13
> Published: Unknown

## Ideia Central

"The LLM writes and maintains the wiki; the human reads and asks questions."
"The wiki is a persistent, compounding artifact."

Um **LLM wiki** é um sistema de conhecimento onde o LLM mantém páginas estruturadas em vez de re-pesquisar documentos brutos a cada pergunta. Novas fontes são compiladas em páginas duráveis de markdown, referências cruzadas são atualizadas ao longo do tempo, e respostas citam as páginas do wiki que já contêm o conhecimento sintetizado.

## Arquitetura em Três Camadas

**raw/** — Material fonte imutável. O LLM lê, nunca modifica. Organizado por subdiretórios de tópico.

**wiki/** — Artigos de conhecimento compilados. O LLM tem propriedade total. Organizado por subdiretórios de tópico, apenas um nível: `wiki/<tópico>/<artigo>.md`. Contém dois arquivos especiais:
- `wiki/index.md` — Índice global. Uma linha por artigo, agrupado por tópico.
- `wiki/log.md` — Log de operações append-only.

**SKILL.md** — Camada de esquema. Define estrutura e regras de workflow.

## Três Operações

| Operação | O que faz | Saída |
|----------|-----------|-------|
| **Ingest** | Coleta uma fonte em `raw/` e compila no wiki | Páginas novas ou atualizadas |
| **Query** | Busca no wiki e responde com citações | Respostas fundamentadas linkando para páginas markdown |
| **Lint** | Verifica integridade do índice, links e saúde do wiki | Auto-correções e problemas reportados |

## Workflow de Ingest

1. Buscar fonte → salvar em `raw/<tópico>/YYYY-MM-DD-slug.md` (imutável)
2. Compilar para `wiki/<tópico>/<artigo>.md` — sintetizar, não copiar
3. Cascade updates: verificar artigos relacionados que precisam de atualização
4. Atualizar `wiki/index.md` e appendar em `wiki/log.md`

Regras de compilação:
- Mesma tese central de artigo existente → merge
- Conceito novo → criar novo artigo
- Abrange múltiplos tópicos → colocar no mais relevante + See Also

## LLM Wiki vs RAG

| Abordagem | Conhecimento vive em | Quando a síntese acontece | Bom para |
|-----------|---------------------|--------------------------|----------|
| **RAG** | Chunks brutos e embeddings | No momento da query | Recuperação ampla em grandes corpora |
| **LLM Wiki** | Páginas markdown curadas | Durante ingest e manutenção | Conhecimento composto, resumos e cross-links duráveis |

O wiki é otimizado para conhecimento que melhora ao longo do tempo, em vez de re-derivar relacionamentos a cada query.

## Por Que Composição Importa

Cada nova fonte pode:
- Atualizar múltiplas páginas
- Fortalecer referências cruzadas
- Registrar contradições entre fontes
- Ampliar artigos existentes em vez de criar duplicatas

O conhecimento **compõe** — artigos ficam mais ricos a cada ingest, não mais fragmentados.

## Compatibilidade

Funciona com Claude Code, Cursor, Codex CLI, OpenCode e qualquer ferramenta que suporte o padrão Agent Skills (agentskills.io). Instalar via `npx add-skill Astro-Han/karpathy-llm-wiki`.

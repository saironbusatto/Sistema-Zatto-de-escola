# Obsidian como Sistema de Gestão de Conhecimento

> Sources: Steph Ango / kepano (obsidian-skills, Unknown)
> Raw: [Obsidian Skills Plugin — kepano](../../raw/knowledge-management/obsidian-skills-plugin.md)

## Overview

Obsidian é uma ferramenta de gestão de conhecimento pessoal (PKM) baseada em arquivos markdown locais. Sua filosofia central é que conhecimento deve ser organizado como um grafo interligado de notas simples — legíveis por humanos, portáveis e sem lock-in. O LLM pode escrever, editar e navegar esse grafo usando o `obsidian` CLI ou diretamente nos arquivos.

## Princípios Fundamentais

**Tudo é arquivo** — Cada nota é um `.md` comum. Sem banco de dados proprietário, sem formato binário. O vault inteiro é uma pasta no sistema de arquivos.

**Pensamento conectado** — Wikilinks (`[[Nota]]`) criam conexões entre conceitos. Backlinks automáticos revelam quem aponta para uma nota. O grafo emerge das ligações, não de hierarquias forçadas.

**Local-first** — Os dados pertencem ao usuário. Sem obrigatoriedade de nuvem. Sincronização é opcional e plugável.

**Extensível** — Plugins, temas e CSS customizado permitem adaptar o sistema a qualquer fluxo de trabalho.

## Estrutura de um Vault

```
vault/
├── Notas/
│   └── conceito.md           ← nota com wikilinks e frontmatter
├── Daily Notes/
│   └── 2026-05-13.md         ← nota diária
├── Bases/
│   └── tarefas.base          ← view database das notas
└── Canvases/
    └── arquitetura.canvas    ← mapa visual
```

## Organização do Conhecimento

Obsidian favorece organização **emergente** sobre hierarquias rígidas:

- Tags e propriedades (frontmatter) classificam notas sem movê-las de pasta
- Wikilinks criam relações semânticas entre conceitos
- Bases consultam notas como se fossem linhas de banco de dados, filtrando por tag, propriedade ou pasta
- Canvas organiza notas espacialmente para raciocínio visual

## Markdown com Superpoderes

Além do Markdown padrão, o Obsidian entende:

- `[[wikilinks]]` — links internos rastreáveis (Obsidian atualiza automaticamente ao renomear)
- `![[embed]]` — embeds de notas, imagens, PDFs
- `> [!callout]` — blocos de destaque com tipos semânticos (note, warning, tip, etc.)
- Frontmatter YAML — propriedades estruturadas (date, tags, aliases, status, etc.)
- `==highlight==` — destaque visual
- `%%comentário%%` — comentário oculto no reading view

## Quando Usar Obsidian no Workflow com LLM

| Tarefa | Ferramenta |
|--------|-----------|
| Ler/criar/editar notas no vault aberto | `obsidian` CLI |
| Criar notas markdown offline | Escrever arquivo `.md` direto |
| Consultar notas como banco de dados | `.base` file (Bases) |
| Mapear arquitetura ou fluxo visualmente | `.canvas` file (JSON Canvas) |
| Extrair conteúdo limpo de URL para ingerir | `defuddle` CLI |

## See Also

- [LLM Wiki Workflow](llm-wiki-workflow.md)
- [Obsidian Ferramentas Técnicas](obsidian-tools-reference.md)

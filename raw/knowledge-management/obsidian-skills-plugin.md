# Obsidian Skills Plugin — kepano

> Source: https://github.com/kepano/obsidian-skills (marketplace Claude Code)
> Collected: 2026-05-13
> Published: Unknown

## Visão Geral

Plugin para Claude Code criado por Steph Ango (criador do Obsidian e do Minimal theme). Empacota 5 skills para trabalhar com Obsidian como sistema de gestão de conhecimento.

## Filosofia Central do Obsidian

- **Tudo é arquivo** — Conhecimento vive em markdown simples, sem lock-in
- **Pensamento conectado** — Wikilinks criam um grafo de conhecimento interligado
- **Local-first** — Seus dados, seu vault, sem dependência de nuvem
- **Extensível** — Plugins, temas, CSS customizado
- **Vistas estruturadas** — Bases para consultar notas como banco de dados
- **Pensamento visual** — Canvas para organização espacial de ideias

## Skill 1: obsidian-cli

CLI `obsidian` para interagir com uma instância do Obsidian em execução.

Operações principais:
- `obsidian read file="Nota"` — ler nota
- `obsidian create name="Nova Nota" content="# Olá"` — criar nota
- `obsidian append file="Nota" content="nova linha"` — appendar conteúdo
- `obsidian search query="termo" limit=10` — buscar no vault
- `obsidian daily:read` / `obsidian daily:append` — notas diárias
- `obsidian property:set name="status" value="done"` — editar propriedades
- `obsidian tasks daily todo` — listar tarefas
- `obsidian backlinks file="Nota"` — ver backlinks

Para desenvolvimento de plugins:
- `obsidian plugin:reload id=meu-plugin` — recarregar plugin
- `obsidian dev:errors` — ver erros
- `obsidian dev:screenshot path=ss.png` — screenshot
- `obsidian eval code="app.vault.getFiles().length"` — executar JS no contexto do app

## Skill 2: obsidian-markdown (Obsidian Flavored Markdown)

Extensões do Obsidian sobre CommonMark/GFM:

**Wikilinks:**
```
[[Nota]]                    Link para nota
[[Nota|Texto exibido]]      Texto customizado
[[Nota#Heading]]            Link para seção
![[Nota]]                   Embed de nota
![[imagem.png|300]]         Embed de imagem com largura
```

**Callouts:**
```
> [!note] Título
> Conteúdo do callout

> [!warning]- Recolhido por padrão
> Conteúdo
```
Tipos: note, tip, warning, info, example, quote, bug, danger, success, failure, question, abstract, todo

**Properties (Frontmatter):**
```yaml
---
title: Minha Nota
date: 2026-05-13
tags:
  - projeto
aliases:
  - Nome Alternativo
cssclasses:
  - classe-customizada
---
```

**Outras extensões:**
- `==texto destacado==` — highlight
- `%%comentário oculto%%` — comentário invisível no reading view
- Blocos LaTeX: `$inline$` e `$$block$$`
- Diagramas Mermaid em code blocks

## Skill 3: obsidian-bases

Arquivos `.base` — views database-like de notas. YAML válido.

Estrutura:
```yaml
filters:         # Quais notas incluir
formulas:        # Propriedades computadas
properties:      # Display names
summaries:       # Fórmulas de aggregação
views:           # table | cards | list | map
```

Tipos de propriedades:
- **Note properties** — frontmatter da nota
- **File properties** — `file.name`, `file.mtime`, `file.size`, `file.tags`, `file.backlinks`
- **Formula properties** — `formula.minha_formula`

Exemplos de fórmulas:
```yaml
formulas:
  dias_restantes: 'if(due, (date(due) - today()).days, "")'
  status_icon: 'if(done, "✅", "⏳")'
  dias_criado: '(now() - file.ctime).days'
```

**Armadilha:** subtração de datas retorna Duration, não número. Usar `.days` antes de `.round()`.

## Skill 4: json-canvas

Arquivos `.canvas` — canvases visuais seguindo a spec JSON Canvas 1.0.

```json
{
  "nodes": [...],
  "edges": [...]
}
```

Tipos de nó: `text`, `file`, `link`, `group`
Atributos obrigatórios: `id` (hex 16 chars), `type`, `x`, `y`, `width`, `height`

Edges conectam nós via `fromNode`/`toNode`. Opcionalmente `fromSide`/`toSide` (top/right/bottom/left), `label`, `color`.

Cores preset: "1"=vermelho, "2"=laranja, "3"=amarelo, "4"=verde, "5"=ciano, "6"=roxo

## Skill 5: defuddle

CLI para extrair conteúdo limpo de páginas web, removendo navegação, ads e ruído.

```bash
defuddle parse <url> --md              # markdown limpo
defuddle parse <url> --md -o out.md    # salvar em arquivo
defuddle parse <url> -p title          # extrair metadado específico
```

Preferir sobre WebFetch para páginas web padrão. Não usar para URLs que já são `.md`.
Instalar: `npm install -g defuddle`

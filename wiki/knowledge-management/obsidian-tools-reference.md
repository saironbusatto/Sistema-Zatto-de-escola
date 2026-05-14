# Obsidian Ferramentas Técnicas

> Sources: Steph Ango / kepano (obsidian-skills, Unknown)
> Raw: [Obsidian Skills Plugin — kepano](../../raw/knowledge-management/obsidian-skills-plugin.md)

## Overview

Referência técnica das quatro ferramentas do ecossistema Obsidian usadas via LLM: CLI para interação com vault, Bases para views estruturadas, JSON Canvas para mapas visuais e Defuddle para extração de conteúdo web.

## obsidian CLI

Requer Obsidian aberto. Usa o vault em foco por padrão; `vault="Nome"` para especificar.

**Leitura e escrita:**
```bash
obsidian read file="Nota"
obsidian create name="Nova" content="# Conteúdo" template="Template" silent
obsidian append file="Nota" content="linha nova"
obsidian search query="termo" limit=10
```

**Notas diárias:**
```bash
obsidian daily:read
obsidian daily:append content="- [ ] tarefa"
```

**Propriedades e tarefas:**
```bash
obsidian property:set name="status" value="done" file="Nota"
obsidian tasks daily todo
obsidian backlinks file="Nota"
obsidian tags sort=count counts
```

**Desenvolvimento de plugins:**
```bash
obsidian plugin:reload id=meu-plugin
obsidian dev:errors
obsidian dev:screenshot path=ss.png
obsidian eval code="app.vault.getFiles().length"
```

Flags úteis: `silent` (não abre o arquivo), `--copy` (copia saída para clipboard), `total` (conta em listas).

## Obsidian Bases (.base)

Arquivos YAML com extensão `.base` que criam views database-like das notas do vault.

**Estrutura completa:**
```yaml
filters:          # Filtro global (todas as views)
  and:
    - 'file.hasTag("projeto")'
    - 'status != "done"'

formulas:
  dias_restantes: 'if(due, (date(due) - today()).days, "")'
  icone: 'if(done, "✅", "⏳")'

properties:
  formula.dias_restantes:
    displayName: "Dias Restantes"

views:
  - type: table
    name: "Ativas"
    order: [file.name, status, formula.dias_restantes]
    groupBy:
      property: status
      direction: ASC
```

**Propriedades de arquivo disponíveis:** `file.name`, `file.path`, `file.folder`, `file.size`, `file.ctime`, `file.mtime`, `file.tags`, `file.links`, `file.backlinks`

**Armadilhas de fórmula:**
- Subtração de datas → Duration, não número. Usar `.days`: `(now() - file.ctime).days`
- Propriedades ausentes → usar `if()` como guard: `'if(due, (date(due) - today()).days, "")'`
- `formula.X` em `order` exige definição em `formulas`

**Tipos de view:** `table`, `cards`, `list`, `map`

## JSON Canvas (.canvas)

Spec aberta ([jsoncanvas.org](https://jsoncanvas.org/spec/1.0/)). Dois arrays: `nodes` e `edges`.

**Tipos de nó:**
```json
{ "id": "6f0ad84f44ce9c17", "type": "text", "x": 0, "y": 0, "width": 400, "height": 200, "text": "# Título\n\nConteúdo **markdown**." }
{ "id": "...", "type": "file", "file": "pasta/nota.md", "x": 500, "y": 0, "width": 400, "height": 300 }
{ "id": "...", "type": "link", "url": "https://exemplo.com", "x": 0, "y": 300, "width": 400, "height": 200 }
{ "id": "...", "type": "group", "label": "Grupo", "x": -50, "y": -50, "width": 1000, "height": 600, "color": "4" }
```

**Edge:**
```json
{ "id": "...", "fromNode": "id1", "fromSide": "right", "toNode": "id2", "toSide": "left", "label": "leva a" }
```

IDs: hex 16 chars aleatórios. Cores preset: `"1"`=vermelho, `"2"`=laranja, `"3"`=amarelo, `"4"`=verde, `"5"`=ciano, `"6"`=roxo.

Layout: `x` cresce para direita, `y` para baixo. Espaçar nós 50-100px. Coordenadas negativas são válidas.

**Atenção:** usar `\n` para quebra de linha em strings JSON. Nunca `\\n`.

## defuddle

Extrai conteúdo limpo de páginas web removendo navegação, anúncios e ruído.

```bash
npm install -g defuddle          # instalar uma vez

defuddle parse <url> --md        # markdown limpo
defuddle parse <url> --md -o out.md   # salvar em arquivo
defuddle parse <url> -p title    # só o título
defuddle parse <url> -p description
```

**Regra:** usar defuddle em vez de WebFetch para qualquer URL de página web comum. Não usar para URLs que já terminam em `.md` — esses já são markdown, usar WebFetch direto.

## See Also

- [Obsidian como Sistema de Gestão de Conhecimento](obsidian-pkm.md)
- [LLM Wiki Workflow](llm-wiki-workflow.md)

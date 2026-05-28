// Conteúdo canônico do Módulo 0 — fonte de verdade até Sprint 5 (migração para admin panel)
// Após Sprint 5, este arquivo é substituído pelo conteúdo editável via /admin

const SVGs = {
  1: `<svg width="100%" viewBox="0 0 640 300" role="img">
    <title>Abertura — humano e IA como parceiros</title>
    <desc>Ilustração mostrando a lacuna entre ter acesso à IA e ser fluente nela</desc>
    <defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <circle cx="120" cy="100" r="26" fill="none" stroke="#2d5fa3" stroke-width="1.5"/>
    <text class="th" x="120" y="104" text-anchor="middle" dominant-baseline="central" font-size="22">👤</text>
    <rect class="c-blue" x="80" y="138" width="80" height="36" rx="8" stroke-width="0.5"/>
    <text class="th" x="120" y="158" text-anchor="middle" dominant-baseline="central">Você</text>
    <line x1="162" y1="118" x2="218" y2="118" stroke="#888780" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ar)"/>
    <rect class="c-amber" x="200" y="88" width="120" height="44" rx="10" stroke-width="0.5"/>
    <text class="th" x="260" y="106" text-anchor="middle" dominant-baseline="central">Lacuna</text>
    <text class="ts" x="260" y="122" text-anchor="middle" dominant-baseline="central">acesso ≠ fluência</text>
    <line x1="322" y1="118" x2="378" y2="118" stroke="#888780" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#ar)"/>
    <circle cx="430" cy="100" r="26" fill="none" stroke="#1a7a45" stroke-width="1.5"/>
    <text class="th" x="430" y="104" text-anchor="middle" dominant-baseline="central" font-size="22">🤖</text>
    <rect class="c-teal" x="390" y="138" width="80" height="36" rx="8" stroke-width="0.5"/>
    <text class="th" x="430" y="158" text-anchor="middle" dominant-baseline="central">Claude</text>
    <text class="ts" x="320" y="220" text-anchor="middle">Com fluência em IA:</text>
    <rect class="c-green" x="160" y="235" width="320" height="40" rx="10" stroke-width="0.5"/>
    <text class="th" x="320" y="255" text-anchor="middle" dominant-baseline="central">Eficaz · Eficiente · Ético · Seguro</text>
  </svg>`,

  2: `<svg width="100%" viewBox="0 0 640 280" role="img">
    <title>Por que fluência — o que muda com ela</title>
    <desc>Comparação entre usar IA sem fluência e usar com fluência</desc>
    <rect class="c-red" x="40" y="40" width="240" height="44" rx="10" stroke-width="0.5"/>
    <text class="th" x="160" y="62" text-anchor="middle" dominant-baseline="central">Sem fluência em IA</text>
    <rect class="box" x="40" y="100" width="240" height="36" rx="8" stroke-width="0.5"/>
    <text class="ts" x="160" y="120" text-anchor="middle" dominant-baseline="central">Resultados frustrantes</text>
    <rect class="box" x="40" y="146" width="240" height="36" rx="8" stroke-width="0.5"/>
    <text class="ts" x="160" y="166" text-anchor="middle" dominant-baseline="central">Tempo perdido com retrabalho</text>
    <rect class="box" x="40" y="192" width="240" height="36" rx="8" stroke-width="0.5"/>
    <text class="ts" x="160" y="212" text-anchor="middle" dominant-baseline="central">Risco de confiar em erros</text>
    <line x1="320" y1="40" x2="320" y2="240" stroke="#d4d0c8" stroke-width="0.5" stroke-dasharray="4 4"/>
    <rect class="c-teal" x="360" y="40" width="240" height="44" rx="10" stroke-width="0.5"/>
    <text class="th" x="480" y="62" text-anchor="middle" dominant-baseline="central">Com fluência em IA</text>
    <rect class="c-green" x="360" y="100" width="240" height="36" rx="8" stroke-width="0.5" style="opacity:.7"/>
    <text class="th" x="480" y="120" text-anchor="middle" dominant-baseline="central">Resultados de alta qualidade</text>
    <rect class="c-green" x="360" y="146" width="240" height="36" rx="8" stroke-width="0.5" style="opacity:.5"/>
    <text class="th" x="480" y="166" text-anchor="middle" dominant-baseline="central">Tempo economizado</text>
    <rect class="c-green" x="360" y="192" width="240" height="36" rx="8" stroke-width="0.5" style="opacity:.4"/>
    <text class="th" x="480" y="212" text-anchor="middle" dominant-baseline="central">Uso responsável e seguro</text>
  </svg>`,

  3: `<svg width="100%" viewBox="0 0 640 310" role="img">
    <title>Os 3 modos de interação com IA</title>
    <desc>Automação, Aumento e Agência ilustrados com exemplos</desc>
    <rect class="c-blue" x="30" y="30" width="174" height="44" rx="10" stroke-width="0.5"/>
    <text class="th" x="117" y="52" text-anchor="middle" dominant-baseline="central">1. Automação</text>
    <rect class="box" x="30" y="90" width="174" height="80" rx="8" stroke-width="0.5"/>
    <text class="ts" x="117" y="118" text-anchor="middle">Você instrui</text>
    <text class="ts" x="117" y="136" text-anchor="middle">IA executa</text>
    <text class="ts" x="117" y="154" text-anchor="middle" style="font-style:italic">"Resuma este contrato"</text>
    <rect class="box" x="30" y="188" width="174" height="36" rx="8" stroke-width="0.5"/>
    <text class="ts" x="117" y="208" text-anchor="middle" dominant-baseline="central">Resultado definido</text>
    <rect class="c-teal" x="234" y="30" width="172" height="44" rx="10" stroke-width="1"/>
    <text class="th" x="320" y="52" text-anchor="middle" dominant-baseline="central">2. Aumento ★</text>
    <rect class="c-teal" x="234" y="90" width="172" height="80" rx="8" stroke-width="0.5" style="opacity:.4"/>
    <text class="ts" x="320" y="118" text-anchor="middle">Vocês colaboram</text>
    <text class="ts" x="320" y="136" text-anchor="middle">como parceiros</text>
    <text class="ts" x="320" y="154" text-anchor="middle" style="font-style:italic">"Explore a tese comigo"</text>
    <rect class="c-teal" x="234" y="188" width="172" height="36" rx="8" stroke-width="0.5" style="opacity:.6"/>
    <text class="ts" x="320" y="208" text-anchor="middle" dominant-baseline="central">Resultado emergente</text>
    <rect class="c-purple" x="436" y="30" width="174" height="44" rx="10" stroke-width="0.5"/>
    <text class="th" x="523" y="52" text-anchor="middle" dominant-baseline="central">3. Agência</text>
    <rect class="box" x="436" y="90" width="174" height="80" rx="8" stroke-width="0.5"/>
    <text class="ts" x="523" y="118" text-anchor="middle">IA age em</text>
    <text class="ts" x="523" y="136" text-anchor="middle">seu nome</text>
    <text class="ts" x="523" y="154" text-anchor="middle" style="font-style:italic">"Monitor de prazos"</text>
    <rect class="box" x="436" y="188" width="174" height="36" rx="8" stroke-width="0.5"/>
    <text class="ts" x="523" y="208" text-anchor="middle" dominant-baseline="central">Autônomo com limites</text>
    <text class="ts" x="320" y="260" text-anchor="middle">★ O mais poderoso — onde humano e IA se complementam</text>
  </svg>`,

  4: `<svg width="100%" viewBox="0 0 640 320" role="img">
    <title>Framework 4D — Delegação, Descrição, Discernimento, Diligência</title>
    <desc>Os quatro quadrantes do Framework 4D da Anthropic</desc>
    <defs><marker id="ar4" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <circle cx="320" cy="160" r="44" fill="none" stroke="#d4d0c8" stroke-width="0.5" stroke-dasharray="4 4"/>
    <text class="th" x="320" y="155" text-anchor="middle" dominant-baseline="central">4D</text>
    <text class="ts" x="320" y="172" text-anchor="middle" dominant-baseline="central">Framework</text>
    <rect class="c-blue" x="40" y="30" width="190" height="90" rx="12" stroke-width="0.5"/>
    <text class="th" x="135" y="60" text-anchor="middle" dominant-baseline="central">Delegação</text>
    <text class="ts" x="135" y="80" text-anchor="middle" dominant-baseline="central">Quando usar IA?</text>
    <text class="ts" x="135" y="98" text-anchor="middle" dominant-baseline="central">O que delegar?</text>
    <line x1="230" y1="100" x2="280" y2="130" stroke="#378ADD" stroke-width="1" marker-end="url(#ar4)" fill="none"/>
    <rect class="c-teal" x="410" y="30" width="190" height="90" rx="12" stroke-width="0.5"/>
    <text class="th" x="505" y="60" text-anchor="middle" dominant-baseline="central">Descrição</text>
    <text class="ts" x="505" y="80" text-anchor="middle" dominant-baseline="central">Como comunicar?</text>
    <text class="ts" x="505" y="98" text-anchor="middle" dominant-baseline="central">Produto, processo, tom</text>
    <line x1="410" y1="100" x2="360" y2="130" stroke="#1D9E75" stroke-width="1" marker-end="url(#ar4)" fill="none"/>
    <rect class="c-purple" x="40" y="200" width="190" height="90" rx="12" stroke-width="0.5"/>
    <text class="th" x="135" y="230" text-anchor="middle" dominant-baseline="central">Discernimento</text>
    <text class="ts" x="135" y="250" text-anchor="middle" dominant-baseline="central">Como avaliar?</text>
    <text class="ts" x="135" y="268" text-anchor="middle" dominant-baseline="central">Checar qualidade</text>
    <line x1="230" y1="222" x2="280" y2="192" stroke="#7F77DD" stroke-width="1" marker-end="url(#ar4)" fill="none"/>
    <rect class="c-amber" x="410" y="200" width="190" height="90" rx="12" stroke-width="0.5"/>
    <text class="th" x="505" y="230" text-anchor="middle" dominant-baseline="central">Diligência</text>
    <text class="ts" x="505" y="250" text-anchor="middle" dominant-baseline="central">Como usar com responsab.?</text>
    <text class="ts" x="505" y="268" text-anchor="middle" dominant-baseline="central">Ético e seguro</text>
    <line x1="410" y1="222" x2="360" y2="192" stroke="#BA7517" stroke-width="1" marker-end="url(#ar4)" fill="none"/>
  </svg>`,

  5: `<svg width="100%" viewBox="0 0 640 340" role="img">
    <title>A esteira sequencial vs o Transformer — evolução da IA</title>
    <desc>Antes de 2017 a IA processava em fila; o Transformer processa tudo em paralelo</desc>
    <defs><marker id="ar5" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <text class="th" x="160" y="36" text-anchor="middle" dominant-baseline="central">Antes de 2017</text>
    <g class="c-gray"><rect x="30" y="56" width="52" height="36" rx="6" stroke-width="0.5"/><text class="th" x="56" y="75" text-anchor="middle" dominant-baseline="central">O</text></g>
    <line x1="83" y1="74" x2="98" y2="74" stroke="#d4d0c8" stroke-width="1" marker-end="url(#ar5)"/>
    <g class="c-gray"><rect x="100" y="56" width="80" height="36" rx="6" stroke-width="0.5"/><text class="th" x="140" y="75" text-anchor="middle" dominant-baseline="central">contrato</text></g>
    <line x1="181" y1="74" x2="196" y2="74" stroke="#d4d0c8" stroke-width="1" marker-end="url(#ar5)"/>
    <g style="opacity:.55"><rect class="c-gray" x="198" y="56" width="52" height="36" rx="6" stroke-width="0.5"/><text class="th" x="224" y="75" text-anchor="middle" dominant-baseline="central">de</text></g>
    <line x1="251" y1="74" x2="266" y2="74" stroke="#d4d0c8" stroke-width="1" marker-end="url(#ar5)" style="opacity:.4"/>
    <g style="opacity:.25"><rect class="c-gray" x="268" y="56" width="80" height="36" rx="6" stroke-width="0.5"/><text class="th" x="308" y="75" text-anchor="middle" dominant-baseline="central">rescisão</text></g>
    <line x1="349" y1="74" x2="364" y2="74" stroke="#d4d0c8" stroke-width="1" style="opacity:.15" marker-end="url(#ar5)"/>
    <g style="opacity:.1"><rect class="c-gray" x="366" y="56" width="70" height="36" rx="6" stroke-width="0.5"/><text class="th" x="401" y="75" text-anchor="middle" dominant-baseline="central">cláusula</text></g>
    <text class="ts" x="30" y="110" dominant-baseline="central">memorizada</text>
    <text class="ts" x="400" y="110" dominant-baseline="central" text-anchor="end">esquecida</text>
    <line x1="110" y1="107" x2="360" y2="107" stroke="#d4d0c8" stroke-width="0.5" stroke-dasharray="3 3" marker-end="url(#ar5)"/>
    <line x1="320" y1="130" x2="320" y2="340" stroke="#d4d0c8" stroke-width="0.5" stroke-dasharray="4 4"/>
    <rect class="c-amber" x="258" y="128" width="124" height="28" rx="6" stroke-width="0.5"/>
    <text class="th" x="320" y="143" text-anchor="middle" dominant-baseline="central">2017 — Transformer</text>
    <text class="th" x="490" y="36" text-anchor="middle" dominant-baseline="central">Depois do Transformer</text>
    <g class="c-teal"><rect x="350" y="56" width="52" height="36" rx="6" stroke-width="0.5"/><text class="th" x="376" y="75" text-anchor="middle" dominant-baseline="central">o</text></g>
    <g class="c-amber"><rect x="420" y="56" width="70" height="36" rx="6" stroke-width="1"/><text class="th" x="455" y="75" text-anchor="middle" dominant-baseline="central">banco</text></g>
    <g class="c-teal"><rect x="508" y="56" width="70" height="36" rx="6" stroke-width="0.5"/><text class="th" x="543" y="75" text-anchor="middle" dominant-baseline="central">sacar</text></g>
    <line x1="455" y1="92" x2="376" y2="160" stroke="#BA7517" stroke-width="0.5" opacity="0.3" fill="none"/>
    <line x1="455" y1="92" x2="543" y2="160" stroke="#1D9E75" stroke-width="3" opacity="0.85" fill="none"/>
    <g class="c-teal"><rect x="350" y="165" width="80" height="36" rx="6" stroke-width="0.5"/><text class="th" x="390" y="184" text-anchor="middle" dominant-baseline="central">dinheiro</text></g>
    <g class="c-teal"><rect x="450" y="165" width="80" height="36" rx="6" stroke-width="0.5"/><text class="th" x="490" y="184" text-anchor="middle" dominant-baseline="central">estava</text></g>
    <g class="c-teal"><rect x="548" y="165" width="62" height="36" rx="6" stroke-width="0.5"/><text class="th" x="579" y="184" text-anchor="middle" dominant-baseline="central">cheio</text></g>
    <line x1="455" y1="92" x2="390" y2="165" stroke="#1D9E75" stroke-width="2" opacity="0.6" fill="none"/>
    <rect class="c-teal" x="350" y="230" width="260" height="36" rx="8" stroke-width="0.5" style="opacity:.7"/>
    <text class="th" x="480" y="249" text-anchor="middle" dominant-baseline="central">"banco" = financeiro (contexto resolvido)</text>
    <text class="ts" x="480" y="288" text-anchor="middle">Todas as palavras conectadas ao mesmo tempo</text>
  </svg>`,

  6: `<svg width="100%" viewBox="0 0 640 320" role="img">
    <title>Capacidades e limitações do Claude</title>
    <desc>O que Claude faz muito bem versus suas 6 limitações reais</desc>
    <rect class="c-teal" x="30" y="30" width="270" height="40" rx="10" stroke-width="0.5"/>
    <text class="th" x="165" y="50" text-anchor="middle" dominant-baseline="central">Claude faz muito bem</text>
    <rect class="box" x="30" y="82" width="270" height="30" rx="6" stroke-width="0.5"/>
    <text class="ts" x="165" y="97" text-anchor="middle" dominant-baseline="central">Escrita, resumo, tradução, explicação</text>
    <rect class="box" x="30" y="118" width="270" height="30" rx="6" stroke-width="0.5"/>
    <text class="ts" x="165" y="133" text-anchor="middle" dominant-baseline="central">Lê documentos inteiros (200k tokens)</text>
    <rect class="box" x="30" y="154" width="270" height="30" rx="6" stroke-width="0.5"/>
    <text class="ts" x="165" y="169" text-anchor="middle" dominant-baseline="central">Mantém contexto da conversa</text>
    <rect class="box" x="30" y="190" width="270" height="30" rx="6" stroke-width="0.5"/>
    <text class="ts" x="165" y="205" text-anchor="middle" dominant-baseline="central">Raciocínio multi-etapa e análise</text>
    <rect class="c-red" x="340" y="30" width="270" height="40" rx="10" stroke-width="0.5"/>
    <text class="th" x="475" y="50" text-anchor="middle" dominant-baseline="central">6 limitações reais</text>
    <rect class="box" x="340" y="82" width="270" height="30" rx="6" stroke-width="0.5"/>
    <text class="ts" x="475" y="97" text-anchor="middle" dominant-baseline="central">1. Corte de conhecimento (data)</text>
    <rect class="c-red" x="340" y="118" width="270" height="30" rx="8" stroke-width="0.5" style="opacity:.6"/>
    <text class="th" x="475" y="133" text-anchor="middle" dominant-baseline="central">2. Alucinação — inventa fatos</text>
    <rect class="box" x="340" y="154" width="270" height="30" rx="6" stroke-width="0.5"/>
    <text class="ts" x="475" y="169" text-anchor="middle" dominant-baseline="central">3. Janela de contexto limitada</text>
    <rect class="box" x="340" y="190" width="270" height="30" rx="6" stroke-width="0.5"/>
    <text class="ts" x="475" y="205" text-anchor="middle" dominant-baseline="central">4. Respostas variáveis (não determinístico)</text>
    <rect class="c-amber" x="30" y="248" width="580" height="40" rx="10" stroke-width="0.5"/>
    <text class="th" x="320" y="268" text-anchor="middle" dominant-baseline="central">Claude auxilia · você verifica · você assina</text>
  </svg>`,

  7: `<svg width="100%" viewBox="0 0 640 280" role="img">
    <title>Exercício — mapeamento 4D</title>
    <desc>Card do exercício prático final da aula</desc>
    <defs><marker id="ar7" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M2 1L8 5L2 9" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></marker></defs>
    <rect class="c-gray" x="30" y="30" width="580" height="44" rx="10" stroke-width="0.5"/>
    <text class="th" x="320" y="52" text-anchor="middle" dominant-baseline="central">Exercício — Meu primeiro mapeamento 4D</text>
    <g class="c-blue"><rect x="30" y="96" width="130" height="60" rx="8" stroke-width="0.5"/><text class="th" x="95" y="120" text-anchor="middle" dominant-baseline="central">1</text><text class="ts" x="95" y="138" text-anchor="middle" dominant-baseline="central">Escolha uma tarefa</text></g>
    <line x1="162" y1="126" x2="178" y2="126" stroke="#378ADD" stroke-width="1.5" marker-end="url(#ar7)"/>
    <g class="c-teal"><rect x="180" y="96" width="130" height="60" rx="8" stroke-width="0.5"/><text class="th" x="245" y="120" text-anchor="middle" dominant-baseline="central">2</text><text class="ts" x="245" y="138" text-anchor="middle" dominant-baseline="central">Qual modo?</text></g>
    <line x1="312" y1="126" x2="328" y2="126" stroke="#1D9E75" stroke-width="1.5" marker-end="url(#ar7)"/>
    <g class="c-purple"><rect x="330" y="96" width="130" height="60" rx="8" stroke-width="0.5"/><text class="th" x="395" y="120" text-anchor="middle" dominant-baseline="central">3</text><text class="ts" x="395" y="138" text-anchor="middle" dominant-baseline="central">Aplique os 4Ds</text></g>
    <line x1="462" y1="126" x2="478" y2="126" stroke="#7F77DD" stroke-width="1.5" marker-end="url(#ar7)"/>
    <g class="c-amber"><rect x="480" y="96" width="130" height="60" rx="8" stroke-width="0.5"/><text class="th" x="545" y="120" text-anchor="middle" dominant-baseline="central">4</text><text class="ts" x="545" y="138" text-anchor="middle" dominant-baseline="central">Compartilhe (1 min)</text></g>
    <rect class="box" x="30" y="190" width="580" height="60" rx="10" stroke-width="0.5"/>
    <text class="ts" x="320" y="215" text-anchor="middle" dominant-baseline="central">Próxima aula: prompting eficaz — aplicando Descrição</text>
    <text class="ts" x="320" y="237" text-anchor="middle" dominant-baseline="central">de produto, processo e desempenho na prática</text>
  </svg>`
};

const CONTEUDOS = {
  1: {
    eye:"Abertura · 0–10 min",
    titulo:"Ter acesso à IA não é o mesmo que ser fluente nela",
    corpo:`<p>A frustração que muita gente sente ao usar Claude ou ChatGPT tem um nome: é a <strong>lacuna entre ter acesso a uma ferramenta poderosa e saber colaborar com ela de verdade.</strong></p>
    <div class="destaque"><h4>O que é Fluência em IA?</h4><p>Interagir com sistemas de IA de formas eficazes, eficientes, éticas e seguras. Não é sobre decorar prompts — é sobre desenvolver habilidades que continuam relevantes mesmo quando a tecnologia muda.</p></div>`,
    temPergunta:true
  },
  2: {
    eye:"Por que fluência · 10–25 min",
    titulo:"A IA está mudando como trabalhamos — mas exige uma nova habilidade",
    corpo:`<p>A IA está transformando como nos comunicamos, criamos e resolvemos problemas. Mas ter acesso a esses sistemas não significa automaticamente saber tirar o máximo deles.</p>
    <p>Fluência em IA é o que preenche essa lacuna — não com truques, mas com competências que duram.</p>`,
    temPergunta:false
  },
  3: {
    eye:"Os 3 modos · 25–40 min",
    titulo:"Existem 3 formas de trabalhar com IA — a maioria usa só uma",
    corpo:`<div class="modos">
      <div class="modo m1"><div class="modo-num n1">1</div><div class="modo-body"><h4>Automação</h4><p>Você instrui, a IA executa. Bom quando o resultado é claro.</p><div class="modo-ex">Ex: "Resuma este contrato em 5 pontos."</div></div></div>
      <div class="modo m2"><div class="modo-num n2">2</div><div class="modo-body"><h4>Aumento ★</h4><p>Você e a IA colaboram. A IA não faz por você — faz melhor com você.</p><div class="modo-ex">Ex: Explorar estratégia de negociação juntos.</div></div></div>
      <div class="modo m3"><div class="modo-num n3">3</div><div class="modo-body"><h4>Agência</h4><p>A IA age em seu nome dentro de limites que você define.</p><div class="modo-ex">Ex: Monitoramento automático de prazos.</div></div></div>
    </div>`,
    temPergunta:true
  },
  4: {
    eye:"Framework 4D · 40–55 min",
    titulo:"Os 4Ds — as competências que fazem toda a diferença",
    corpo:`<div class="quadro4d">
      <div class="dcard d1"><div class="dcard-label l1">Delegação</div><h4>Quando usar IA?</h4><p>Entender o problema e distribuir o trabalho estrategicamente.</p></div>
      <div class="dcard d2"><div class="dcard-label l2">Descrição</div><h4>Como comunicar?</h4><p>Produto, processo e desempenho — muito além de escrever prompts.</p></div>
      <div class="dcard d3"><div class="dcard-label l3">Discernimento</div><h4>Como avaliar?</h4><p>Seu controle de qualidade sobre o que a IA produz.</p></div>
      <div class="dcard d4"><div class="dcard-label l4">Diligência</div><h4>Como usar responsavelmente?</h4><p>Segurança, transparência e responsabilidade pelo resultado.</p></div>
    </div>
    <p>O que torna os 4Ds valiosos: funcionam com qualquer IA, hoje e no futuro.</p>`,
    temPergunta:false
  },
  5: {
    eye:"Como funciona a IA · 55–70 min",
    titulo:"O que mudou em 2017 — e por que Claude consegue ler seu contrato inteiro",
    corpo:`<p>Antes de 2017, a IA processava texto palavra por palavra, em fila — esquecendo o começo antes de chegar ao fim.</p>
    <div class="destaque"><h4>O paper que mudou tudo</h4><p>"Attention Is All You Need" (Google, 2017) — o mecanismo de atenção permitiu que todas as palavras fossem processadas ao mesmo tempo. Contexto longo, finalmente possível.</p></div>
    <p>Hoje Claude lê até 200.000 tokens de uma vez — um contrato inteiro, um processo judicial completo.</p>`,
    temPergunta:false
  },
  6: {
    eye:"Capacidades e limitações · 70–85 min",
    titulo:"O que Claude faz bem — e as 6 limitações que você precisa conhecer",
    corpo:`<div class="limits">
      <div class="limit"><div class="limit-ico">📅</div><div><h4>Data de corte</h4><p>Não sabe sobre eventos após o treinamento.</p></div></div>
      <div class="limit"><div class="limit-ico">⚠️</div><div><h4>Alucinação</h4><p>Pode inventar fatos com total confiança — leis, jurisprudências, números.</p></div></div>
      <div class="limit"><div class="limit-ico">📏</div><div><h4>Janela de contexto</h4><p>Conversas muito longas podem perder o início.</p></div></div>
      <div class="limit"><div class="limit-ico">🎲</div><div><h4>Respostas variáveis</h4><p>A mesma pergunta pode ter respostas diferentes.</p></div></div>
      <div class="limit"><div class="limit-ico">🔒</div><div><h4>Acesso limitado</h4><p>Não sabe nada sobre o banco de dados interno da empresa.</p></div></div>
    </div>
    <div class="alerta"><div class="alerta-ico">⚖️</div><div><h4>Caso real — Mata v. Avianca (2023)</h4><p>Advogados punidos por citar jurisprudências inventadas pelo ChatGPT. <strong>Claude auxilia, você verifica, você assina.</strong></p></div></div>`,
    temPergunta:true
  },
  7: {
    eye:"Exercício · 85–90 min",
    titulo:"Exercício prático — meu primeiro mapeamento 4D",
    corpo:`<ol style="padding-left:20px;font-size:14px;line-height:2;">
      <li>Escolha uma tarefa repetitiva da sua área</li>
      <li>Identifique o modo: automação, aumento ou agência</li>
      <li>Aplique os 4Ds: o que delegaria? Como descreveria? O que verificaria? Que cuidados teria?</li>
      <li>Compartilhe em 1 minuto</li>
    </ol>
    <div class="checklist" style="margin-top:20px;">
      <h4>O que aprendi nesta aula</h4>
      <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo a diferença entre automação, aumento e agência</div></div>
      <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei o que são os 4Ds e para que serve cada um</div></div>
      <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Entendo por que o Transformer mudou a IA em 2017</div></div>
      <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Conheço as limitações reais do Claude</div></div>
      <div class="check-item" onclick="toggleCheck(this)"><div class="check-box"></div><div class="check-text">Sei: Claude auxilia, eu verifico, eu assino</div></div>
    </div>`,
    temPergunta:true
  }
};

const BLOCOS_PROF = [
  {id:1,titulo:"Abertura e gancho",tempo:"0–10 min",
    fala:'"Quem aqui já ficou frustrado com o ChatGPT ou Claude? Levanta a mão." — Espere o silêncio. "Esse sentimento não é culpa de vocês. É porque a maioria interage com IA como se fosse um Google melhorado. Não é. Hoje vamos mudar isso."',
    notas:[{tipo:"g",icon:"💡",texto:"<strong>Gancho:</strong> Pergunte 'O que sua tela tem em comum com a IA?' Deixe 2-3 respostas vierem, depois revele a conexão pixel → matriz → GPU → Transformer."},{tipo:"w",icon:"⏱",texto:"Máximo 10 minutos. Corte se engajar demais."}]},
  {id:2,titulo:"Por que fluência em IA?",tempo:"10–25 min",
    fala:'"Fluência em IA significa interagir de formas eficazes, eficientes, éticas e seguras. Não é sobre decorar prompts — é sobre desenvolver habilidades que continuam relevantes mesmo quando a tecnologia muda."',
    notas:[{tipo:"p",icon:"❓",texto:"<strong>Pergunta de ativação:</strong> 'Alguém já teve uma situação onde a IA deu uma resposta que parecia certa mas estava errada?' — Colete 2-3 exemplos."},{tipo:"g",icon:"📚",texto:"Fonte: Vídeo 1 + 2A da Anthropic Academy."}]},
  {id:3,titulo:"Os 3 modos de interação",tempo:"25–40 min",
    fala:'"Existem três formas de trabalhar com IA: Automação, Aumento e Agência. A maioria das pessoas fica presa só na automação."',
    notas:[{tipo:"w",icon:"⚠️",texto:"<strong>Cuidado com Agência:</strong> Reforce: 'A IA nunca assina um documento. Você sempre supervisiona.'"},{tipo:"g",icon:"💡",texto:"'O aumento e a agência são onde a IA realmente brilha — mas exigem mais fluência para usar bem.'"}]},
  {id:4,titulo:"O Framework 4D",tempo:"40–55 min",
    fala:'"Os 4Ds: Delegação, Descrição, Discernimento, Diligência. Funcionam com qualquer IA, hoje e no futuro."',
    notas:[{tipo:"p",icon:"❓",texto:"<strong>Atividade rápida (3 min):</strong> 'Em qual dos 4Ds vocês sentem mais dificuldade hoje?' Levantar a mão por D."},{tipo:"g",icon:"📚",texto:"Rick Dakan (Anthropic): 'Não estão ligados a ferramentas específicas — são habilidades fundamentais.'"}]},
  {id:5,titulo:"O que é IA Generativa",tempo:"55–70 min",
    fala:'"Antes de 2017, a IA lia em fila — esquecendo o começo. Em 2017, Attention Is All You Need mudou tudo: processamento paralelo. Claude lê um contrato inteiro de uma vez."',
    notas:[{tipo:"w",icon:"⚠️",texto:"Tom correto: é alfabetização, não engenharia. Nunca use jargão sem analogia."},{tipo:"g",icon:"🎬",texto:"Use os SVGs criados: esteira sequencial → mecanismo de atenção → antes vs depois."}]},
  {id:6,titulo:"Capacidades e limitações",tempo:"70–85 min",
    fala:'"Claude tem 6 limitações reais: data de corte, alucinação, janela de contexto, respostas variáveis, raciocínio complexo, acesso limitado. A regra: Claude auxilia, você verifica, você assina."',
    notas:[{tipo:"w",icon:"⚠️",texto:"<strong>Case real:</strong> Mata v. Avianca (2023) — advogados punidos por citar jurisprudências inventadas."},{tipo:"g",icon:"📚",texto:"Fonte: Vídeo 3B Anthropic. Use a mesma ordem das 6 limitações do material oficial."}]},
  {id:7,titulo:"Exercício + Fechamento",tempo:"85–90 min",
    fala:'"Exercício: pensem em uma tarefa do dia a dia. Qual modo usariam? Como aplicariam os 4Ds? 1 minuto cada."',
    notas:[{tipo:"g",icon:"💡",texto:"Recursos pós-aula: Playlist YouTube Anthropic Academy · anthropic.skilljar.com"},{tipo:"p",icon:"📋",texto:"Lembre de coletar feedback via pergunta final."}]}
];

const QUIZZES = [
  {
    apos_bloco: 4,
    perguntas: [
      { pergunta: 'Qual dos 4Ds trata de QUANDO e COMO usar a IA?', opcao_a: 'Delegação', opcao_b: 'Descrição', opcao_c: 'Discernimento', opcao_d: 'Diligência', correta: 0, tempo_seg: 20 },
      { pergunta: 'Você recebeu uma análise do Claude. Verificar se está correta e completa é qual D?', opcao_a: 'Delegação', opcao_b: 'Descrição', opcao_c: 'Discernimento', opcao_d: 'Diligência', correta: 2, tempo_seg: 20 },
      { pergunta: 'Um advogado cita jurisprudência gerada pelo Claude sem verificar. Qual D foi negligenciado?', opcao_a: 'Delegação', opcao_b: 'Descrição', opcao_c: 'Discernimento', opcao_d: 'Diligência', correta: 3, tempo_seg: 25 },
    ]
  },
  {
    apos_bloco: 6,
    perguntas: [
      { pergunta: 'Claude inventa fatos com total confiança. Como se chama esse fenômeno?', opcao_a: 'Bias', opcao_b: 'Alucinação', opcao_c: 'Overfitting', opcao_d: 'Timeout', correta: 1, tempo_seg: 20 },
      { pergunta: 'O que é a janela de contexto de um LLM?', opcao_a: 'O tamanho da tela do usuário', opcao_b: 'Limite de quanto processa de uma vez', opcao_c: 'Número de idiomas que conhece', opcao_d: 'Velocidade de resposta', correta: 1, tempo_seg: 25 },
    ]
  }
];

const EXERCICIOS = [
  { apos_bloco: 4, tipo: 'cenario_4d' },
  { apos_bloco: 6, tipo: 'chat_livre' },
  { apos_bloco: 7, tipo: 'reflexao'   },
];

module.exports = { SVGs, CONTEUDOS, BLOCOS_PROF, QUIZZES, EXERCICIOS };

// Popula o banco com o conteúdo do Módulo 0.
// Rodar uma vez: node db/seed.js
// Idempotente: não duplica se já executado.

const { getDb } = require('./database.js');
const { SVGs, CONTEUDOS, BLOCOS_PROF, QUIZZES, EXERCICIOS } = require('./content/modulo0.js');

const db = getDb();

const existe = db.prepare("SELECT id FROM modulos WHERE slug = 'modulo-0'").get();
if (existe) {
  console.log('Módulo 0 já existe no banco. Seed ignorado.');
  process.exit(0);
}

const insertModulo = db.prepare(`
  INSERT INTO modulos (slug, titulo, subtitulo, duracao_min, ordem, publicado)
  VALUES (@slug, @titulo, @subtitulo, @duracao_min, @ordem, @publicado)
`);

const insertBloco = db.prepare(`
  INSERT INTO blocos
    (modulo_id, ordem, eye, titulo, corpo_html, svg, tempo_min, tem_pergunta, pergunta_padrao, roteiro_fala, roteiro_notas)
  VALUES
    (@modulo_id, @ordem, @eye, @titulo, @corpo_html, @svg, @tempo_min, @tem_pergunta, @pergunta_padrao, @roteiro_fala, @roteiro_notas)
`);

const insertQuiz = db.prepare(`
  INSERT INTO quizzes (bloco_id, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, correta, tempo_seg, ordem)
  VALUES (@bloco_id, @pergunta, @opcao_a, @opcao_b, @opcao_c, @opcao_d, @correta, @tempo_seg, @ordem)
`);

const insertExercicio = db.prepare(`
  INSERT INTO exercicios (bloco_id, tipo, ordem)
  VALUES (@bloco_id, @tipo, @ordem)
`);

const TEMPOS = { 1:10, 2:15, 3:15, 4:15, 5:15, 6:15, 7:5 };

const seed = db.transaction(() => {
  // Módulo
  const { lastInsertRowid: moduloId } = insertModulo.run({
    slug: 'modulo-0',
    titulo: 'Aula 0.1 — Introdução à IA e ao Framework 4D',
    subtitulo: 'Módulo 0 · Framework 4D · 90 min',
    duracao_min: 90,
    ordem: 0,
    publicado: 1,
  });

  // Mapa bloco_num → bloco_id para vincular quizzes e exercícios
  const blocoIdPorNum = {};

  for (let num = 1; num <= 7; num++) {
    const c = CONTEUDOS[num];
    const p = BLOCOS_PROF[num - 1];

    const { lastInsertRowid: blocoId } = insertBloco.run({
      modulo_id:       moduloId,
      ordem:           num,
      eye:             c.eye,
      titulo:          c.titulo,
      corpo_html:      c.corpo,
      svg:             SVGs[num] || '',
      tempo_min:       TEMPOS[num],
      tem_pergunta:    c.temPergunta ? 1 : 0,
      pergunta_padrao: p?.notas?.find(n => n.tipo === 'p')?.texto?.replace(/<[^>]+>/g, '') || null,
      roteiro_fala:    p?.fala || '',
      roteiro_notas:   JSON.stringify(p?.notas || []),
    });

    blocoIdPorNum[num] = blocoId;
    console.log(`  bloco ${num}: ${c.titulo.slice(0, 50)}`);
  }

  // Quizzes — vinculados ao bloco que vem logo antes
  for (const grupo of QUIZZES) {
    const blocoId = blocoIdPorNum[grupo.apos_bloco];
    grupo.perguntas.forEach((q, i) => {
      insertQuiz.run({ bloco_id: blocoId, ...q, ordem: i });
    });
    console.log(`  quizzes após bloco ${grupo.apos_bloco}: ${grupo.perguntas.length} questões`);
  }

  // Exercícios
  for (let i = 0; i < EXERCICIOS.length; i++) {
    const ex = EXERCICIOS[i];
    insertExercicio.run({ bloco_id: blocoIdPorNum[ex.apos_bloco], tipo: ex.tipo, ordem: i });
    console.log(`  exercício '${ex.tipo}' após bloco ${ex.apos_bloco}`);
  }
});

console.log('Populando Módulo 0...');
seed();
console.log('\n✅ Seed concluído.');

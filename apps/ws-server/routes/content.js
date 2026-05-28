// GET /api/content/:slug — endpoint público para a aula ao vivo
// Retorna módulo + blocos + quizzes + exercícios (apenas publicados)

const express = require('express');
const { getDb } = require('../db/database.js');

const router = express.Router();

router.get('/:slug', (req, res) => {
  const db  = getDb();
  const mod = db.prepare('SELECT * FROM modulos WHERE slug = ? AND publicado = 1').get(
    String(req.params.slug || '').slice(0, 80)
  );
  if (!mod) return res.status(404).json({ erro: 'Módulo não encontrado ou não publicado' });

  const blocos = db.prepare(
    'SELECT * FROM blocos WHERE modulo_id = ? AND publicado = 1 ORDER BY ordem, id'
  ).all(mod.id);

  const modoProfessor = req.query.mode === 'professor';

  for (const bloco of blocos) {
    bloco.quizzes    = db.prepare('SELECT * FROM quizzes    WHERE bloco_id = ? ORDER BY ordem, id').all(bloco.id);
    bloco.exercicios = db.prepare('SELECT * FROM exercicios WHERE bloco_id = ? ORDER BY ordem, id').all(bloco.id);
    if (!modoProfessor) {
      // Roteiro é exclusivo do professor — não expor aos alunos
      delete bloco.roteiro_fala;
      delete bloco.roteiro_notas;
    }
  }

  res.json({ ...mod, blocos });
});

module.exports = router;

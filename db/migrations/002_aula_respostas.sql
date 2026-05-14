CREATE TABLE aula_respostas (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  tipo        TEXT    NOT NULL CHECK (tipo IN ('pergunta','quiz','exercicio')),
  nome_aluno  TEXT    NOT NULL,
  bloco_id    INTEGER,
  dados       TEXT    NOT NULL DEFAULT '{}',
  criado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_aula_respostas_tipo     ON aula_respostas(tipo);
CREATE INDEX idx_aula_respostas_criado   ON aula_respostas(criado_em);

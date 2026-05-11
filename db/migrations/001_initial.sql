CREATE TABLE modulos (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  titulo        TEXT    NOT NULL,
  subtitulo     TEXT,
  duracao_min   INTEGER NOT NULL DEFAULT 90,
  ordem         INTEGER NOT NULL DEFAULT 0,
  publicado     INTEGER NOT NULL DEFAULT 0,
  criado_em     TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE blocos (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  modulo_id       INTEGER NOT NULL REFERENCES modulos(id) ON DELETE CASCADE,
  ordem           INTEGER NOT NULL DEFAULT 0,
  eye             TEXT,
  titulo          TEXT    NOT NULL,
  corpo_html      TEXT    NOT NULL DEFAULT '',
  svg             TEXT    NOT NULL DEFAULT '',
  tempo_min       INTEGER NOT NULL DEFAULT 10,
  tem_pergunta    INTEGER NOT NULL DEFAULT 0,
  pergunta_padrao TEXT,
  roteiro_fala    TEXT    NOT NULL DEFAULT '',
  roteiro_notas   TEXT    NOT NULL DEFAULT '[]',
  publicado       INTEGER NOT NULL DEFAULT 1,
  criado_em       TEXT    NOT NULL DEFAULT (datetime('now')),
  atualizado_em   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE quizzes (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  bloco_id  INTEGER NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
  pergunta  TEXT    NOT NULL,
  opcao_a   TEXT    NOT NULL,
  opcao_b   TEXT    NOT NULL,
  opcao_c   TEXT    NOT NULL,
  opcao_d   TEXT    NOT NULL,
  correta   INTEGER NOT NULL CHECK (correta IN (0,1,2,3)),
  tempo_seg INTEGER NOT NULL DEFAULT 20 CHECK (tempo_seg BETWEEN 5 AND 120),
  ordem     INTEGER NOT NULL DEFAULT 0,
  criado_em TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE exercicios (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  bloco_id  INTEGER NOT NULL REFERENCES blocos(id) ON DELETE CASCADE,
  tipo      TEXT    NOT NULL CHECK (tipo IN ('cenario_4d','chat_livre','reflexao')),
  ordem     INTEGER NOT NULL DEFAULT 0,
  criado_em TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  nome          TEXT,
  criado_em     TEXT NOT NULL DEFAULT (datetime('now')),
  ultimo_login  TEXT
);

CREATE INDEX idx_blocos_modulo_ordem ON blocos(modulo_id, ordem);
CREATE INDEX idx_quizzes_bloco       ON quizzes(bloco_id);
CREATE INDEX idx_exercicios_bloco    ON exercicios(bloco_id);

CREATE TABLE platform_users (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  clerk_user_id     TEXT NOT NULL UNIQUE,
  email             TEXT,
  role              TEXT NOT NULL CHECK (role IN ('root','professor','aluno')),
  status            TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
  invited_by_user_id INTEGER REFERENCES platform_users(id) ON DELETE SET NULL,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_platform_users_role ON platform_users(role);

CREATE TABLE professor_students (
  professor_user_id INTEGER NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  student_user_id   INTEGER NOT NULL REFERENCES platform_users(id) ON DELETE CASCADE,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (professor_user_id, student_user_id)
);

CREATE INDEX idx_professor_students_student ON professor_students(student_user_id);

CREATE TABLE platform_invites (
  id                   INTEGER PRIMARY KEY AUTOINCREMENT,
  token                TEXT NOT NULL UNIQUE,
  type                 TEXT NOT NULL CHECK (type IN ('professor','aluno')),
  email                TEXT,
  professor_user_id    INTEGER REFERENCES platform_users(id) ON DELETE SET NULL,
  invited_by_clerk_id  TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','accepted','revoked','expired')),
  expires_at           TEXT,
  accepted_by_clerk_id TEXT,
  accepted_at          TEXT,
  created_at           TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_platform_invites_type_status ON platform_invites(type, status);

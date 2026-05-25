-- db/schema.sql
CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  form_type   TEXT NOT NULL,
  data        TEXT NOT NULL,  -- JSON con todos los campos del formulario
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_form_type ON submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON submissions(created_at);

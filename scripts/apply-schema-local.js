import { Database } from 'bun:sqlite';
import { readFileSync } from 'node:fs';

const dbPath = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/b2161d96896e8133447dc86559ac9009f07c1f426444109bce0ae14ece93f87e.sqlite';
const schema = readFileSync('db/schema.sql', 'utf-8');

const db = new Database(dbPath);
const statements = schema.split(';').filter(s => s.trim());

for (const stmt of statements) {
  if (stmt.trim()) {
    db.run(stmt + ';');
  }
}

console.log('Schema applied successfully to local D1 database');

// Verify
const tables = db.query("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

db.close();

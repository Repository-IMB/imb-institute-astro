import { Database } from 'bun:sqlite';

const dbPath = '.wrangler/state/v3/d1/miniflare-D1DatabaseObject/b2161d96896e8133447dc86559ac9009f07c1f426444109bce0ae14ece93f87e.sqlite';
const db = new Database(dbPath);

const testData = {
  nombres: 'Ana',
  apellidos: 'García',
  telefono: '999888777',
  correo: 'ana.garcia@ejemplo.com',
  consulta: 'Hola, me gustaría recibir información sobre los cursos de diplomado.',
};

db.run(
  'INSERT INTO submissions (form_type, data, created_at) VALUES (?, ?, datetime("now", "-1 days"))',
  ['contacto', JSON.stringify(testData)]
);

const testData2 = {
  nombres: 'Carlos',
  telefono: '987654321',
  correo: 'carlos@ejemplo.com',
  cursoNombre: 'Diplomado en Gestión Pública',
};

db.run(
  'INSERT INTO submissions (form_type, data, created_at) VALUES (?, ?, datetime("now"))',
  ['asesor', JSON.stringify(testData2)]
);

// Verify
const count = db.query('SELECT COUNT(*) as count FROM submissions').get();
console.log('Total submissions in local DB:', count.count);

const rows = db.query('SELECT id, form_type, created_at FROM submissions ORDER BY id DESC').all();
console.log('Rows:', rows);

db.close();

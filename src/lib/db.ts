import type { FormType, Submission } from '../types/submission';

export async function insertSubmission(
  db: D1Database,
  form_type: FormType,
  data: Record<string, unknown>
): Promise<number> {
  const result = await db
    .prepare(
      'INSERT INTO submissions (form_type, data, created_at) VALUES (?, ?, datetime("now"))'
    )
    .bind(form_type, JSON.stringify(data))
    .run();

  if (!result.success) {
    throw new Error('Failed to insert submission');
  }

  const meta = result.meta as unknown as { last_row_id?: number; changes?: number };
  return meta.last_row_id ?? 0;
}

export async function getSubmissions(
  db: D1Database,
  options?: {
    form_type?: FormType;
    limit?: number;
    offset?: number;
    startDate?: string;
    endDate?: string;
  }
): Promise<Submission[]> {
  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (options?.form_type) {
    conditions.push('form_type = ?');
    values.push(options.form_type);
  }

  if (options?.startDate) {
    conditions.push('date(created_at) >= date(?)');
    values.push(options.startDate);
  }

  if (options?.endDate) {
    conditions.push('date(created_at) <= date(?)');
    values.push(options.endDate);
  }

  let sql = 'SELECT * FROM submissions';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY created_at DESC';

  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;
  sql += ' LIMIT ? OFFSET ?';
  values.push(limit, offset);

  const result = await db.prepare(sql).bind(...values).all();

  if (!result.success) {
    throw new Error('Failed to fetch submissions');
  }

  return (result.results as Record<string, unknown>[]).map((row) => ({
    id: row.id as number,
    form_type: row.form_type as FormType,
    data: JSON.parse(row.data as string) as Record<string, unknown>,
    created_at: row.created_at as string,
  }));
}

export async function getSubmissionsCount(
  db: D1Database,
  form_type?: FormType
): Promise<number> {
  let sql = 'SELECT COUNT(*) as count FROM submissions';
  const values: string[] = [];

  if (form_type) {
    sql += ' WHERE form_type = ?';
    values.push(form_type);
  }

  const result = await db.prepare(sql).bind(...values).first();
  return (result?.count as number) ?? 0;
}

export async function getSubmissionsCountByType(
  db: D1Database
): Promise<{ form_type: string; count: number }[]> {
  const result = await db
    .prepare('SELECT form_type, COUNT(*) as count FROM submissions GROUP BY form_type ORDER BY count DESC')
    .all();

  if (!result.success) {
    throw new Error('Failed to fetch submission counts');
  }

  return (result.results as Record<string, unknown>[]).map((row) => ({
    form_type: row.form_type as string,
    count: row.count as number,
  }));
}

export async function getRecentSubmissions(
  db: D1Database,
  days: number = 7
): Promise<Submission[]> {
  const result = await db
    .prepare(
      'SELECT * FROM submissions WHERE date(created_at) >= date("now", "-" || ? || " days") ORDER BY created_at DESC LIMIT 50'
    )
    .bind(days)
    .all();

  if (!result.success) {
    throw new Error('Failed to fetch recent submissions');
  }

  return (result.results as Record<string, unknown>[]).map((row) => ({
    id: row.id as number,
    form_type: row.form_type as FormType,
    data: JSON.parse(row.data as string) as Record<string, unknown>,
    created_at: row.created_at as string,
  }));
}

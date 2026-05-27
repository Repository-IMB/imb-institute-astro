import type { Submission } from '../types/submission';

function escapeCSV(value: unknown): string {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function generateCSV(submissions: Submission[]): string {
  if (submissions.length === 0) {
    return '';
  }

  // Collect all unique keys from data objects
  const dataKeys = new Set<string>();
  for (const s of submissions) {
    for (const key of Object.keys(s.data)) {
      dataKeys.add(key);
    }
  }
  const sortedDataKeys = Array.from(dataKeys).sort();

  // Build header
  const headers = ['id', 'form_type', 'created_at', ...sortedDataKeys];
  const lines: string[] = [headers.map(escapeCSV).join(',')];

  // Build rows
  for (const s of submissions) {
    const row = [
      s.id,
      s.form_type,
      s.created_at,
      ...sortedDataKeys.map((key) => s.data[key]),
    ];
    lines.push(row.map(escapeCSV).join(','));
  }

  return lines.join('\r\n');
}

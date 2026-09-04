import { ActionError } from 'astro:actions';
import { env } from 'cloudflare:workers';
import { getFormRecipients } from '../config/form-recipients';
import { sendMail } from '../lib/email';
import { buildEmail } from '../lib/email/template';
import type { FormType } from '../types/submission';
import { saveSubmissionAndNotify } from './utils';
import { readFormFiles, type FileRule } from './files';

export interface SubmissionOptions {
  type: FormType;
  emailTitle: string;
  arrayFields?: string[];
  requiredArrays?: string[];
  files?: FileRule[];
}

export async function saveSubmission(
  input: Record<string, unknown>,
  context: { request: Request },
  options: SubmissionOptions,
) {
  const formData = await context.request.clone().formData();
  const data: Record<string, unknown> = { ...input };
  const attachments: { name: string; content: string }[] = [];

  for (const field of options.arrayFields ?? []) {
    const values = formData.getAll(field).filter((value): value is string => typeof value === 'string' && value.trim().length > 0);
    data[field] = values;
    if (options.requiredArrays?.includes(field) && values.length === 0) {
      throw new ActionError({ code: 'BAD_REQUEST', message: 'Selecciona al menos una opción en los campos obligatorios.' });
    }
  }

  for (const rule of options.files ?? []) {
    const result = await readFormFiles(formData, rule);
    attachments.push(...result.attachments);
    data[rule.field] = result.metadata;
  }

  const emailTemplate = buildEmail(options.emailTitle, data);
  const id = await saveSubmissionAndNotify(options.type, data, () =>
    sendMail({
      from: env.MAIL_FROM,
      to: getFormRecipients(options.type, env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO),
      ...emailTemplate,
      tag: options.type,
      ...(attachments.length > 0 ? { attachment: attachments } : {}),
    }),
  );

  return { success: true, id };
}
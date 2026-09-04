import { defineAction } from 'astro:actions';
import { env } from 'cloudflare:workers';
import { sendMail } from '../lib/email';
import { buildEmail } from '../lib/email/template';
import { saveSubmissionAndNotify } from './utils';
import { getFormRecipients } from '../config/form-recipients';
import { asesorSchema } from './validation/asesor';

export const asesor = defineAction({
  accept: 'form',
  input: asesorSchema,
  handler: async (input, context) => {
    const cursoNombre = context.url.searchParams.get('cursoNombre') || input.cursoNombre;
    const data = { ...input, cursoNombre };
    const emailTemplate = buildEmail('Asesor', data);
    const id = await saveSubmissionAndNotify('asesor', data, () =>
      sendMail({ from: env.MAIL_FROM, to: getFormRecipients('asesor', env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO), ...emailTemplate, tag: 'asesor' }),
    );
    return { success: true, id };
  }
});
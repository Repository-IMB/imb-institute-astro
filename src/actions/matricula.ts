import { defineAction } from 'astro:actions';
import { sendMail } from '../lib/email';
import { buildEmail } from '../lib/email/template';
import { env } from 'cloudflare:workers';
import { saveSubmissionAndNotify } from './utils';
import { getFormRecipients } from '../config/form-recipients';
import { matriculaSchema } from './validation/matricula';

export const matricula = defineAction({
  accept: 'form',
  input: matriculaSchema,
  handler: async (input) => {
    const emailTemplate = buildEmail('Matricula', input);
    const id = await saveSubmissionAndNotify('matricula', input, () =>
      sendMail({ from: env.MAIL_FROM, to: getFormRecipients('matricula', env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO), ...emailTemplate, tag: 'matricula' }),
    );
    return { success: true, id };
  }
});
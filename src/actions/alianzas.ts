import { defineAction } from 'astro:actions';
import { sendMail } from '../lib/email';
import { buildEmail } from '../lib/email/template';
import { env } from 'cloudflare:workers';
import { saveSubmissionAndNotify } from './utils';
import { getFormRecipients } from '../config/form-recipients';
import { alianzasSchema } from './validation/alianzas';

export const alianzas = defineAction({
  accept: 'form',
  input: alianzasSchema,
  handler: async (input) => {
    const emailTemplate = buildEmail('Alianzas_Estrategicas', input);
    const id = await saveSubmissionAndNotify('alianzas', input, () =>
      sendMail({ from: env.MAIL_FROM, to: getFormRecipients('alianzas', env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO), ...emailTemplate, tag: 'alianzas' }),
    );
    return { success: true, id };
  }
});
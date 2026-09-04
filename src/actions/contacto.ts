import { defineAction } from 'astro:actions';
import { env } from 'cloudflare:workers';
import { sendMail } from '../lib/email';
import { buildEmail } from '../lib/email/template';
import { saveSubmissionAndNotify } from './utils';
import { getFormRecipients } from '../config/form-recipients';
import { contactoSchema } from './validation/contacto';

export const contacto = defineAction({
  accept: 'form',
  input: contactoSchema,
  handler: async (input) => {
    const emailTemplate = buildEmail('Contacto', input);
    const id = await saveSubmissionAndNotify('contacto', input, () =>
      sendMail({
        from: env.MAIL_FROM,
        to: getFormRecipients('contacto', env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO),
        ...emailTemplate,
        tag: 'contacto',
      }),
    );
    return { success: true, id };
  }
});
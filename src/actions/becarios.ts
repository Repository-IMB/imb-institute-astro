import { defineAction, ActionError } from 'astro:actions';
import { sendMail } from '../lib/email';
import { buildEmail } from '../lib/email/template';
import { env } from 'cloudflare:workers';
import { saveSubmissionAndNotify } from './utils';
import { getFormRecipients } from '../config/form-recipients';
import { becariosSchema } from './validation/becarios';
import { readFormFiles } from './files';

export const becarios = defineAction({
  accept: 'form',
  input: becariosSchema,
  handler: async (input, context) => {
    const formData = await context.request.clone().formData();
    const { metadata: fileMetadata, attachments } = await readFormFiles(formData, {
      field: 'documentos',
      required: true,
      extensions: ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'],
      maxFiles: 5,
      maxFileSizeMB: 5,
      maxTotalSizeMB: 5,
    });
    const horarioSemanaReal = formData.getAll('horario_semana');
    const horarioFindeReal = formData.getAll('horario_finde');
    if (horarioSemanaReal.length === 0 || horarioFindeReal.length === 0) {
      throw new ActionError({ code: 'BAD_REQUEST', message: 'Selecciona al menos un horario entre semana y otro para fines de semana.' });
    }
    const data = {
      ...input,
      horario_semana: horarioSemanaReal.length ? horarioSemanaReal.join(', ') : 'Ninguno',
      horario_finde: horarioFindeReal.length ? horarioFindeReal.join(', ') : 'Ninguno',
      documentos: fileMetadata,
    };
    const emailTemplate = buildEmail('Programa_Becarios', data);
    const id = await saveSubmissionAndNotify('becarios', data, () =>
      sendMail({ from: env.MAIL_FROM, to: getFormRecipients('becarios', env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO), ...emailTemplate, tag: 'becarios', attachment: attachments }),
    );
    return { success: true, id };
  }
});
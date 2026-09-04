import { defineAction } from 'astro:actions';
import { sendMail } from '../lib/email';
import { buildEmail, buildEmailBase } from '../lib/email/template';
import { env } from 'cloudflare:workers';
import { saveSubmissionAndNotify } from './utils';
import { getFormRecipients } from '../config/form-recipients';
import { reclamacionesSchema } from './validation/reclamaciones';
import { readFormFiles } from './files';

export const reclamaciones = defineAction({
  accept: 'form',
  input: reclamacionesSchema,
  handler: async (input, context) => {
    const formData = await context.request.clone().formData();
    const { metadata, attachments } = await readFormFiles(formData, { field: 'archivo', extensions: ['.pdf', '.jpg', '.jpeg', '.png'], maxFileSizeMB: 5 });
    const { privacidad, ...fields } = input;
    const data = { ...fields, privacidadAceptada: true, ...(metadata.length > 0 ? { archivo: metadata } : {}) };
    const emailTemplate = buildEmail('Libro_de_Reclamaciones', data);
    const id = await saveSubmissionAndNotify('reclamaciones', data, () =>
      sendMail({
        from: env.MAIL_FROM, to: getFormRecipients('reclamaciones', env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO),
        ...emailTemplate, tag: 'reclamaciones', ...(attachments.length > 0 ? { attachment: attachments } : {}),
      }),
    );
    const confirmation = buildEmailBase({
      subject: 'Constancia de registro de reclamación — IMB Institute', title: 'Tu reclamación fue registrada',
      description: 'Conserva este correo como constancia.',
      rows: [ { label: 'Número de registro', value: `#${id}` }, { label: 'Fecha', value: data.fecha }, { label: 'Manifestación', value: data.tipoSolicitud } ],
      replyTo: 'marketing@imbinstitute.com', replyName: 'IMB Institute',
    });
    try { await sendMail({ from: env.MAIL_FROM, to: input.correo, ...confirmation, tag: 'reclamaciones-constancia' }); } catch (err) {}
    return { success: true, id };
  }
});
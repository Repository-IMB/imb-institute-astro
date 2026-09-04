import { defineAction, ActionError } from 'astro:actions';
import { sendMail } from '../lib/email';
import { buildEmail, buildEmailBase } from '../lib/email/template';
import { env } from 'cloudflare:workers';
import { saveSubmissionAndNotify } from './utils';
import { getFormRecipients } from '../config/form-recipients';
import { soporteSchema } from './validation/soporte';

export const soporte = defineAction({
  accept: 'form',
  input: soporteSchema,
  handler: async (input) => {
    if (input.terminos !== 'on') {
      throw new ActionError({ code: 'BAD_REQUEST', message: 'Debes aceptar la Política de Privacidad y el tratamiento de tus datos.' });
    }
    const { terminos, ...fields } = input;
    const data = { ...fields, privacidadAceptada: true };
    const emailTemplate = buildEmail('Soporte', data);
    const id = await saveSubmissionAndNotify('soporte', data, () =>
      sendMail({ from: env.MAIL_FROM, to: getFormRecipients('soporte', env.MAIL_ADMISSIONS_TO, env.MAIL_FORCE_TO), ...emailTemplate, tag: 'soporte' }),
    );
    const confirmation = buildEmailBase({
      subject: 'Recibimos tu consulta académica — IMB Institute',
      title: 'Tu consulta fue registrada',
      description: 'El equipo de soporte académico revisará tu solicitud.',
      rows: [ { label: 'Número de registro', value: `#${id}` }, { label: 'Curso', value: data.curso }, { label: 'Categoría', value: data.categoria } ],
      replyTo: 'academicdir@imbinstitute.com', replyName: 'Soporte académico',
    });
    try {
      await sendMail({ from: env.MAIL_FROM, to: input.correo, ...confirmation, tag: 'soporte-confirmacion' });
    } catch (err) {}
    return { success: true, id };
  }
});
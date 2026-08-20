import { defineAction, ActionError } from 'astro:actions';
import { sendMail } from '../lib/email';
import { buildEmail } from '../lib/email/template';
import { env } from 'cloudflare:workers';
import { z } from 'astro/zod';
import { insertSubmission } from '../lib/db';
import { getDB } from './utils';

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export const academicoActions = {
  matricula: defineAction({
    accept: 'form',
    input: z.object({
      curso: z.string().min(2),
      nombres: z.string().min(2),
      documento: z.string().min(8),
      pais: z.string().min(2),
      correo: z.email(),
      whatsapp: z.string().min(8),
      formacion: z.string().min(2),
      empresa: z.string().optional(),
      cargo: z.string().min(2),
      familiaridad_tecnologica: z.string().min(1),
      tipo_comprobante: z.string().min(1),
      razon_social: z.string().min(2),
      numero_tributario: z.string().optional(),
      nivel_ingles: z.string().optional(),
      nivel_excel: z.string().optional(),
    }),
    handler: async (input) => {
      const db = getDB();
      const id = await insertSubmission(db, 'matricula', input);
      const emailTemplate = buildEmail('Matricula', input);
      try {
        await sendMail({ from: env.MAIL_FROM, to: env.MAIL_ADMISSIONS_TO, ...emailTemplate, tag: 'matricula' });
      } catch (err) {
        console.error('[matricula] Error enviando correo:', err);
      }
      return { success: true, id };
    }
  }),

  becarios: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      apellidos: z.string().min(2),
      documento: z.string().min(6),
      fecha_nacimiento: z.string().min(1),
      correo: z.email(),
      whatsapp: z.string().min(8),
      universidad: z.string().min(2),
      carrera: z.string().min(2),
      ciclo: z.string().min(1),
      asociacion: z.string().min(2),
      horario_semana: z.any().optional(),
      horario_finde: z.any().optional(),
      motivacion: z.string().min(10),
    }),
    handler: async (input, context) => {
      const db = getDB();
      
      const formData = await context.request.clone().formData();
      const files = formData.getAll('documentos') as File[];
      const validFiles = files.filter(f => f.name && f.size > 0);
      const fileMetadata = validFiles.map(f => ({ name: f.name, size: f.size, type: f.type }));
      
      const attachments = await Promise.all(
        validFiles.map(async (f) => {
          const arrayBuffer = await f.arrayBuffer();
          return {
            filename: f.name,
            contentType: f.type,
            content: arrayBufferToBase64(arrayBuffer)
          };
        })
      );

      if (fileMetadata.length === 0) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Debe subir al menos un documento (bases, constancia, certificado o CV).',
        });
      }

      // Astro actions solo toma el último valor de los checkboxes múltiples, así que los extraemos manualmente del FormData
      const horarioSemanaReal = formData.getAll('horario_semana');
      const horarioFindeReal = formData.getAll('horario_finde');

      const data = {
        ...input,
        horario_semana: horarioSemanaReal.length ? horarioSemanaReal.join(', ') : 'Ninguno',
        horario_finde: horarioFindeReal.length ? horarioFindeReal.join(', ') : 'Ninguno',
        documentos: fileMetadata,
      };

      const id = await insertSubmission(db, 'becarios', data);
      const emailTemplate = buildEmail('Programa_Becarios', data);
      try {
        await sendMail({ from: env.MAIL_FROM, to: env.MAIL_ADMISSIONS_TO, ...emailTemplate, tag: 'becarios', attachments });
      } catch (err) {
        console.error('[becarios] Error enviando correo:', err);
      }
      return { success: true, id };
    }
  })
};

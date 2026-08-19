import { defineAction, ActionError } from 'astro:actions';
import { sendMail } from '../lib/email';
import { buildGenericEmail } from '../lib/email/templates/generic';
import { env } from 'cloudflare:workers';
import { z } from 'astro/zod';
import { insertSubmission } from '../lib/db';
import { getDB } from './utils';

export const institucionalActions = {
  soporte: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      correo: z.email(),
      telefono: z.string().min(8),
      curso: z.string().min(2),
      categoria: z.string().min(1),
      mensaje: z.string().min(10),
      terminos: z.literal('on').optional(),
    }),
    handler: async (input) => {
      if (input.terminos !== 'on') {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Debes aceptar los términos y condiciones',
        });
      }
      const db = getDB();
      const { terminos, ...data } = input;
      const id = await insertSubmission(db, 'soporte', data);
      const emailTemplate = buildGenericEmail('Soporte', data);
      try {
        await sendMail({ from: env.MAIL_FROM, to: env.MAIL_ADMISSIONS_TO, ...emailTemplate, tag: 'soporte' });
      } catch (err) {
        console.error('[soporte] Error enviando correo:', err);
      }
      return { success: true, id };
    }
  }),

  reclamaciones: defineAction({
    accept: 'form',
    input: z.object({
      fecha: z.string().min(1),
      nombres: z.string().min(2),
      documento: z.string().min(8),
      telefono: z.string().min(8),
      correo: z.email(),
      direccion: z.string().min(5),
      ciudad: z.string().min(2),
      region: z.string().min(2),
      pais: z.string().min(2),
      apoderado: z.string().optional(),
      tipoBien: z.enum(['Servicio Educativo (Curso/Diplomado)', 'Producto Físico/Certificado']),
      comprobante: z.string().optional(),
      detalleBien: z.string().min(5),
      tipoSolicitud: z.enum(['Reclamo (Disconformidad con el servicio)', 'Queja (Malestar por atención recibida)']),
      detalleReclamo: z.string().min(10),
    }),
    handler: async (input) => {
      const db = getDB();
      const id = await insertSubmission(db, 'reclamaciones', input);
      const emailTemplate = buildGenericEmail('Libro_de_Reclamaciones', input);
      try {
        await sendMail({ from: env.MAIL_FROM, to: env.MAIL_ADMISSIONS_TO, ...emailTemplate, tag: 'reclamaciones' });
      } catch (err) {
        console.error('[reclamaciones] Error enviando correo:', err);
      }
      return { success: true, id };
    }
  }),

  alianzas: defineAction({
    accept: 'form',
    input: z.object({
      empresa: z.string().min(2),
      tipoAlianza: z.string().min(1),
      sector: z.string().min(1),
      correo: z.email(),
      telefono: z.string().min(8).optional().or(z.literal('')),
      descripcion: z.string().min(10).optional().or(z.literal('')),
    }),
    handler: async (input) => {
      const db = getDB();
      const id = await insertSubmission(db, 'alianzas', input);
      const emailTemplate = buildGenericEmail('Alianzas_Estrategicas', input);
      try {
        await sendMail({ from: env.MAIL_FROM, to: env.MAIL_ADMISSIONS_TO, ...emailTemplate, tag: 'alianzas' });
      } catch (err) {
        console.error('[alianzas] Error enviando correo:', err);
      }
      return { success: true, id };
    }
  }),

  staff: defineAction({
    accept: 'form',
    input: z.object({
      nombre_completo: z.string().min(2),
      correo_electronico: z.email(),
      area_postulacion: z.string().min(1),
    }),
    handler: async (input, context) => {
      const db = getDB();
      const formData = await context.request.clone().formData();
      const file = formData.get('cv_pdf') as File;
      
      const fileMetadata = file && file.name && file.size > 0
        ? { name: file.name, size: file.size, type: file.type }
        : null;

      if (!fileMetadata) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Debe subir su currículum vitae en formato PDF.',
        });
      }

      const data = {
        ...input,
        cv_pdf: fileMetadata,
      };

      const id = await insertSubmission(db, 'staff', data);
      const emailTemplate = buildGenericEmail('Postulacion_Staff', data);
      try {
        await sendMail({ from: env.MAIL_FROM, to: env.MAIL_ADMISSIONS_TO, ...emailTemplate, tag: 'staff' });
      } catch (err) {
        console.error('[staff] Error enviando correo:', err);
      }
      return { success: true, id };
    }
  })
};

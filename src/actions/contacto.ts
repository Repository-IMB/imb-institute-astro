import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { env } from 'cloudflare:workers';
import { insertSubmission } from '../lib/db';
import { sendMail } from '../lib/email';
import { buildContactoEmail } from '../lib/email/templates/contacto';
import { getDB } from './utils';

export const contactoActions = {
  contacto: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      apellidos: z.string().min(2),
      telefono: z.string().min(8),
      correo: z.email(),
      consulta: z.string().min(10).optional(),
    }),
    handler: async (input) => {
      const db = getDB();

      const emailTemplate = buildContactoEmail(input);
      try {
        await sendMail({
          from: env.MAIL_FROM,
          to: env.MAIL_ADMISSIONS_TO,
          ...emailTemplate,
          tag: 'contacto',
        });
      } catch (err) {
        const detail = err instanceof Error ? err.message : String(err);
        console.error('[contacto] Error enviando correo:', detail);
        throw new ActionError({
          code: 'INTERNAL_SERVER_ERROR',
          message:
            'No se pudo procesar tu solicitud en este momento. Por favor intenta de nuevo o contáctanos directamente.',
        });
      }

      const id = await insertSubmission(db, 'contacto', input);
      return { success: true, id };
    }
  }),

  asesor: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      telefono: z.string().min(8),
      correo: z.email(),
      cursoNombre: z.string().optional(),
    }),
    handler: async (input, context) => {
      const db = getDB();
      const cursoNombre = context.url.searchParams.get('cursoNombre') || input.cursoNombre;
      const data = { ...input, cursoNombre };
      const id = await insertSubmission(db, 'asesor', data);
      return { success: true, id };
    }
  }),
};

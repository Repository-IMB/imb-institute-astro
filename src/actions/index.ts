import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { env } from 'cloudflare:workers';
import { insertSubmission, getSubmissions } from '../lib/db';
import { generateCSV } from '../lib/csv';
import type { FormType } from '../types/submission';

function getDB(): D1Database {
  const db = env.DB;
  if (!db) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database not available',
    });
  }
  return db;
}

export const server = {
  contacto: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      apellidos: z.string().min(2),
      telefono: z.string().min(8),
      correo: z.string().email(),
      consulta: z.string().min(10).optional(),
    }),
    handler: async (input, context) => {
      const db = getDB();
      const id = await insertSubmission(db, 'contacto', input);
      return { success: true, id };
    }
  }),

  soporte: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      correo: z.string().email(),
      telefono: z.string().min(8),
      curso: z.string().min(2),
      categoria: z.string(),
      mensaje: z.string().min(10),
      terminos: z.literal('on').optional(),
    }),
    handler: async (input, context) => {
      if (input.terminos !== 'on') {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Debes aceptar los términos y condiciones',
        });
      }
      const db = getDB();
      const { terminos, ...data } = input;
      const id = await insertSubmission(db, 'soporte', data);
      return { success: true, id };
    }
  }),

  reclamaciones: defineAction({
    accept: 'form',
    input: z.object({
      fecha: z.string(),
      nombres: z.string().min(2),
      documento: z.string().min(8),
      telefono: z.string().min(8),
      correo: z.string().email(),
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
    handler: async (input, context) => {
      const db = getDB();
      const id = await insertSubmission(db, 'reclamaciones', input);
      return { success: true, id };
    }
  }),

  alianzas: defineAction({
    accept: 'form',
    input: z.object({
      empresa: z.string().min(2),
      tipoAlianza: z.string(),
      sector: z.string(),
      correo: z.string().email(),
      telefono: z.string().min(8),
      descripcion: z.string().min(10).optional(),
    }),
    handler: async (input, context) => {
      const db = getDB();
      const id = await insertSubmission(db, 'alianzas', input);
      return { success: true, id };
    }
  }),

  asesor: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      telefono: z.string().min(8),
      correo: z.string().email(),
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

  matricula: defineAction({
    accept: 'form',
    input: z.object({
      curso: z.string().min(2),
      nombres: z.string().min(2),
      documento: z.string().min(8),
      pais: z.string().min(2),
      correo: z.string().email(),
      whatsapp: z.string().min(8),
      formacion: z.string().min(2),
      empresa: z.string().optional(),
      cargo: z.string().min(2),
      familiaridad_tecnologica: z.string(),
      tipo_comprobante: z.string(),
      razon_social: z.string().min(2),
      numero_tributario: z.string().optional(),
      nivel_ingles: z.string().optional(),
      nivel_excel: z.string().optional(),
    }),
    handler: async (input, context) => {
      const db = getDB();
      const id = await insertSubmission(db, 'matricula', input);
      return { success: true, id };
    }
  }),

  exportCSV: defineAction({
    accept: 'json',
    input: z.object({
      form_type: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
    handler: async (input, context) => {
      const db = getDB();
      const submissions = await getSubmissions(db, {
        form_type: input.form_type as FormType | undefined,
        startDate: input.startDate,
        endDate: input.endDate,
        limit: 10000,
      });
      const csv = generateCSV(submissions);
      return {
        csv,
        filename: `submissions_${new Date().toISOString().split('T')[0]}.csv`,
      };
    }
  })
};

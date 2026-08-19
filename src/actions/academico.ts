import { defineAction, ActionError } from 'astro:actions';
import { z } from 'astro/zod';
import { insertSubmission } from '../lib/db';
import { getDB } from './utils';

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
      horario_semana: z.string().or(z.array(z.string().min(1))).optional(),
      horario_finde: z.string().or(z.array(z.string().min(1))).optional(),
      motivacion: z.string().min(10),
    }),
    handler: async (input, context) => {
      const db = getDB();
      
      const formData = await context.request.clone().formData();
      const files = formData.getAll('documentos') as File[];
      const fileMetadata = files
        .filter(f => f.name && f.size > 0)
        .map(f => ({ name: f.name, size: f.size, type: f.type }));

      if (fileMetadata.length === 0) {
        throw new ActionError({
          code: 'BAD_REQUEST',
          message: 'Debe subir al menos un documento (bases, constancia, certificado o CV).',
        });
      }

      const data = {
        ...input,
        documentos: fileMetadata,
      };

      const id = await insertSubmission(db, 'becarios', data);
      return { success: true, id };
    }
  })
};

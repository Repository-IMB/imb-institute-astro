import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

export const server = {
  contacto: defineAction({
    accept: 'form',
    input: z.object({
      nombres: z.string().min(2),
      apellidos: z.string().min(2),
      codigo_pais: z.string().default('+51'),
      telefono: z.string().min(8),
      correo: z.email(),
      consulta: z.string().min(10).optional(),
    }),
    handler: async (input) => {
      console.log('Contacto form submitted:', input);
      return { success: true };
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
      terminos: z.literal('on'),
    }),
    handler: async (input) => {
      console.log('Soporte form submitted:', input);
      return { success: true };
    }
  }),

  reclamaciones: defineAction({
    accept: 'form',
    input: z.object({
      fecha: z.string(),
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
      console.log('Reclamaciones form submitted:', input);
      return { success: true };
    }
  }),

  alianzas: defineAction({
    accept: 'form',
    input: z.object({
      empresa: z.string().min(2),
      tipoAlianza: z.string(),
      sector: z.string(),
      correo: z.email(),
      telefono: z.string().min(8),
      descripcion: z.string().min(10).optional(),
    }),
    handler: async (input) => {
      console.log('Alianzas form submitted:', input);
      return { success: true };
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
    handler: async (input) => {
      console.log('Asesor form submitted:', input);
      return { success: true };
    }
  }),

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
      familiaridad_tecnologica: z.string(),
      tipo_comprobante: z.string(),
      razon_social: z.string().min(2),
      numero_tributario: z.string().optional(),
      nivel_ingles: z.string().optional(),
      nivel_excel: z.string().optional(),
    }),
    handler: async (input) => {
      console.log('Matricula form submitted:', input);
      return { success: true };
    }
  })
};

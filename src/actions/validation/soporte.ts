import { z } from 'astro/zod';

export const soporteSchema = z.object({
  nombres: z.string().min(2),
  correo: z.email(),
  telefono: z.string().min(8),
  curso: z.string().min(2),
  categoria: z.enum([
    'Problemas con el Aula Virtual (no carga, no se ve)',
    'Consulta sobre Certificados',
    'Soporte Técnico (plataforma, acceso)',
    'Problemas con Links de clase',
    'Problemas con Grabaciones',
    'Otros',
  ]),
  mensaje: z.string().min(10),
  terminos: z.literal('on'),
  estado: z.literal('Pendiente'),
});
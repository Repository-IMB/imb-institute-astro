import { z } from 'astro/zod';

export const contactoSchema = z.object({
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  telefono: z.string().min(8),
  correo: z.email(),
  consulta: z.string().min(10),
});
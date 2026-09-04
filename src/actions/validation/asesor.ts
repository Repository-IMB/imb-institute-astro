import { z } from 'astro/zod';

export const asesorSchema = z.object({
  nombres: z.string().min(2),
  telefono: z.string().min(8),
  correo: z.email(),
  cursoNombre: z.string().optional(),
});
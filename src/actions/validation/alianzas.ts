import { z } from 'astro/zod';

export const alianzasSchema = z.object({
  empresa: z.string().min(2),
  tipoAlianza: z.string().min(1),
  sector: z.string().min(1),
  correo: z.email(),
  telefono: z.string().min(8),
  descripcion: z.string().min(10),
});
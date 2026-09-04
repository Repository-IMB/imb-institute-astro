import { z } from 'astro/zod';

export const becariosSchema = z.object({
  nombres: z.string().min(2),
  apellidos: z.string().min(2),
  documento: z.string().min(6),
  fecha_nacimiento: z.string().min(1),
  correo: z.email(),
  whatsapp: z.string().min(8),
  universidad: z.string().min(2),
  carrera: z.string().min(2),
  ciclo: z.enum([
    '1er Ciclo', '2do Ciclo', '3er Ciclo', '4to Ciclo',
    '5to Ciclo', '6to Ciclo', '7mo Ciclo', '8vo Ciclo',
    '9no Ciclo', '10mo Ciclo', '11vo Ciclo', '12vo Ciclo',
  ]),
  asociacion: z.string().min(2),
  horario_semana: z.any().optional(),
  horario_finde: z.any().optional(),
  motivacion: z.string().min(10),
});
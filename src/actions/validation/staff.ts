import { z } from 'astro/zod';

export const staffSchema = z.object({
  nombre_completo: z.string().min(2),
  correo_electronico: z.email(),
  area_postulacion: z.enum([
    'Docentes',
    'Asesores de Venta',
    'Growth',
    'Product Management',
    'Marketing',
    'Responsabilidad Social',
    'Otro',
  ]),
});
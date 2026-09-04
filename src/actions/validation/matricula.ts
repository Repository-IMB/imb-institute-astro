import { z } from 'astro/zod';

export const matriculaSchema = z.object({
  curso: z.string().min(2),
  nombres: z.string().min(2),
  documento: z.string().min(1).max(25),
  pais: z.string().min(2),
  correo: z.email(),
  whatsapp: z.string().min(8),
  formacion: z.string().optional(),
  empresa: z.string().min(2),
  cargo: z.string().min(2),
  familiaridad_tecnologica: z.enum([
    'No tengo experiencia previa',
    'Básico (uso limitado, con apoyo)',
    'Intermedio (uso habitual de herramientas digitales)',
    'Avanzado (uso frecuente y autónomo)',
  ]),
  tipo_comprobante: z.enum(['Boleta', 'Factura', 'Recibo']),
  razon_social: z.string().min(2).max(25),
  numero_tributario: z.string().min(2).max(25),
  nivel_ingles: z.enum(['Ninguno', 'Básico', 'Intermedio', 'Avanzado']).optional(),
  nivel_excel: z.enum(['Ninguno', 'Básico', 'Intermedio', 'Avanzado']).optional(),
  terminos: z.literal('on', { error: 'Debes aceptar los Términos y Condiciones de Uso' }),
});
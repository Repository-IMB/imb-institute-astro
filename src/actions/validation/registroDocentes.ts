import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const optionalText = z.string().trim().optional();
const email = z.email();
const phone = z.string().trim().min(8);

export const registroDocentesSchema = z.object({
  nombre: text,
  documento: text,
  correo: email,
  telefono: phone,
  direccion: text,
  direccion2: optionalText,
  ciudad: text,
  region: text,
  codigo_postal: text,
  pais: text,
  grado_academico: z.enum(['Licenciatura', 'Tecnicatura', 'Maestría', 'Doctorado']).optional(),
  experiencia_decisiones: optionalText,
  experiencia_docente: optionalText,
});
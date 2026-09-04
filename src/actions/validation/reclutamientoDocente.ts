import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const optionalText = z.string().trim().optional();
const email = z.email();

export const reclutamientoDocenteSchema = z.object({
  nombre: text,
  correo: email,
  direccion: text,
  direccion2: optionalText,
  ciudad: text,
  region: text,
  codigo_postal: text,
  pais: text,
  linkedin: text,
  especialidad: z.enum([
    'Mantenimiento', 'Producción', 'Finanzas', 'RRHH', 'Construcción', 'TI',
    'Salud', 'Agroindustria', 'Calidad', 'Energía', 'Idiomas', 'Legal',
    'Logística', 'Marketing', 'Medio Ambiente', 'Minería', 'Proyectos',
    'Seguridad', 'Innovación y Desarrollo', 'Gestión y Liderazgo',
  ]),
  experiencia_profesional: text,
  experiencia_docente: text,
  habilidades_certificaciones: text,
  disponibilidad: text,
  comentarios: optionalText,
  aceptacion_datos: z.any().optional(),
});
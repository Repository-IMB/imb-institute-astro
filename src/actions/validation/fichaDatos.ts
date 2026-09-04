import { z } from 'astro/zod';

const text = z.string().trim().min(1);
const optionalText = z.string().trim().optional();
const email = z.email();
const phone = z.string().trim().min(8);

export const fichaDatosSchema = z.object({
  nombre: text,
  fecha_nacimiento: text,
  dni: text,
  correo: email,
  celular: phone,
  fecha_inicio: text,
  puesto: text,
  turno: z.enum(['Turno mañana', 'Turno tarde', 'Tiempo completo']),
  direccion: text,
  direccion2: optionalText,
  ciudad: text,
  region: text,
  codigo_postal: text,
  pais: text,
  contacto_referencia: text,
  area_formacion: text,
  nivel_formacion: text,
  centro_estudios: text,
  entidad_bancaria: text,
  numero_cuenta: text,
});
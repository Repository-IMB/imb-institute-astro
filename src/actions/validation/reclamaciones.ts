import { z } from 'astro/zod';

export const reclamacionesSchema = z.object({
  fecha: z.string().min(1),
  nombres: z.string().min(2),
  documento: z.string().min(8),
  telefono: z.string().min(8),
  correo: z.email(),
  direccion: z.string().min(5),
  direccion2: z.string().optional(),
  ciudad: z.string().min(2),
  region: z.string().min(2),
  codigo_postal: z.string().min(2),
  pais: z.string().min(2),
  apoderado: z.string().optional(),
  tipoBien: z.enum(['Producto', 'Servicio']),
  comprobante: z.string().optional(),
  detalleBien: z.string().min(5),
  montoReclamado: z.string().trim().min(1).refine(
    (value) => Number.isFinite(Number(value)) && Number(value) >= 0,
    'Ingresa un monto válido.',
  ),
  descripcionBien: z.string().min(10),
  tipoSolicitud: z.enum(['Reclamo', 'Queja']),
  detalleReclamo: z.string().min(10),
  pedido: z.string().min(5),
  privacidad: z.literal('on'),
});
import { defineAction } from 'astro:actions';
import { reclutamientoDocenteSchema } from './validation/reclutamientoDocente';
import { saveSubmission } from './submissionFactory';

export const reclutamientoDocente = defineAction({
  accept: 'form',
  input: reclutamientoDocenteSchema,
  handler: (input, context) => saveSubmission(input, context, {
    type: 'reclutamiento_docente', emailTitle: 'Reclutamiento_Docente',
    arrayFields: ['aceptacion_datos'], requiredArrays: ['aceptacion_datos'],
    files: [{ field: 'cv_pdf', required: true, extensions: ['.pdf'] }],
  }),
});
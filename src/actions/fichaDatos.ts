import { defineAction } from 'astro:actions';
import { fichaDatosSchema } from './validation/fichaDatos';
import { saveSubmission } from './submissionFactory';

export const fichaDatos = defineAction({
  accept: 'form',
  input: fichaDatosSchema,
  handler: (input, context) => saveSubmission(input, context, {
    type: 'ficha_datos', emailTitle: 'Ficha_de_Datos',
    files: [ { field: 'cv_documentado', extensions: ['.pdf', '.doc', '.docx'], maxFileSizeMB: 5 } ],
  }),
});
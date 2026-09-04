import { defineAction } from 'astro:actions';
import { registroDocentesSchema } from './validation/registroDocentes';
import { saveSubmission } from './submissionFactory';

export const registroDocentes = defineAction({
  accept: 'form',
  input: registroDocentesSchema,
  handler: (input, context) => saveSubmission(input, context, {
    type: 'registro_docentes', emailTitle: 'Registro_de_Docentes',
    files: [
      { field: 'foto_personal', extensions: ['.jpg', '.jpeg', '.png', '.webp'] },
      { field: 'cv_documentado', extensions: ['.pdf', '.doc', '.docx'] },
    ],
  }),
});
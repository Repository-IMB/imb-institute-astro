import { defineAction } from 'astro:actions';
import { matriculaPortuguesSchema } from './validation/matriculaPortugues';
import { saveSubmission } from './submissionFactory';

export const matriculaPortugues = defineAction({
  accept: 'form',
  input: matriculaPortuguesSchema,
  handler: (input, context) => saveSubmission(input, context, {
    type: 'matricula_portugues', emailTitle: 'Matricula_Portugues',
  }),
});
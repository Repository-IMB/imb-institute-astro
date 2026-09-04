import { defineAction, ActionError } from 'astro:actions';
import { staffSchema } from './validation/staff';
import { readFormFiles } from './files';
import { submitStaffApplication } from '../lib/olympus/staff';

export const staff = defineAction({
  accept: 'form',
  input: staffSchema,
  handler: async (input, context) => {
    const formData = await context.request.clone().formData();
    const { files } = await readFormFiles(formData, {
      field: 'cv_pdf', required: true, extensions: ['.pdf'], maxFileSizeMB: 10, encodeAttachments: false,
    });
    try {
      await submitStaffApplication({ ...input, cv_pdf: files[0] });
    } catch (error) {
      throw new ActionError({ code: 'INTERNAL_SERVER_ERROR', message: 'No pudimos registrar tu postulación en este momento.' });
    }
    return { success: true };
  }
});
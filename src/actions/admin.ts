import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';
import { getSubmissions } from '../lib/db';
import { generateCSV } from '../lib/csv';
import type { FormType } from '../types/submission';
import { getDB } from './utils';

export const adminActions = {
  exportCSV: defineAction({
    accept: 'json',
    input: z.object({
      form_type: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }),
    handler: async (input) => {
      const db = getDB();
      const submissions = await getSubmissions(db, {
        form_type: input.form_type as FormType | undefined,
        startDate: input.startDate,
        endDate: input.endDate,
        limit: 10000,
      });
      const csv = generateCSV(submissions);
      return {
        csv,
        filename: `submissions_${new Date().toISOString().split('T')[0]}.csv`,
      };
    }
  }),
  deleteSubmission: defineAction({
    accept: 'json',
    input: z.object({
      id: z.number(),
    }),
    handler: async (input) => {
      const db = getDB();
      const { deleteSubmission } = await import('../lib/db');
      await deleteSubmission(db, input.id);
      return { success: true };
    }
  })
};

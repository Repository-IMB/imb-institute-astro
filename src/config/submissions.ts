import type { FormType } from '../types/submission';

export interface SubmissionTypeMeta {
  label: string;
  badgeClass: string;
  iconClass: string;
}

export const SUBMISSION_TYPE_META: Record<FormType, SubmissionTypeMeta> = {
  contacto: { label: 'Contacto', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/60', iconClass: 'text-blue-600 bg-blue-50/80 border-blue-100' },
  soporte: { label: 'Soporte', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', iconClass: 'text-emerald-600 bg-emerald-50/80 border-emerald-100' },
  reclamaciones: { label: 'Reclamaciones', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/60', iconClass: 'text-rose-600 bg-rose-50/80 border-rose-100' },
  alianzas: { label: 'Alianzas', badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/60', iconClass: 'text-purple-600 bg-purple-50/80 border-purple-100' },
  asesor: { label: 'Asesor', badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/60', iconClass: 'text-amber-600 bg-amber-50/80 border-amber-100' },
  matricula: { label: 'Matrícula', badgeClass: 'bg-red-50 text-red-800 border-red-200/60', iconClass: 'text-red-700 bg-red-50/80 border-red-100' },
  becarios: { label: 'Becarios', badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/60', iconClass: 'text-indigo-600 bg-indigo-50/80 border-indigo-100' },
  staff: { label: 'Staff IMB', badgeClass: 'bg-slate-50 text-slate-700 border-slate-200/60', iconClass: 'text-slate-600 bg-slate-50/80 border-slate-100' },
  reclutamiento_docente: { label: 'Reclutamiento docente', badgeClass: 'bg-violet-50 text-violet-800 border-violet-200/60', iconClass: 'text-violet-700 bg-violet-50/80 border-violet-100' },
  registro_docentes: { label: 'Registro de docentes', badgeClass: 'bg-violet-50 text-violet-800 border-violet-200/60', iconClass: 'text-violet-700 bg-violet-50/80 border-violet-100' },
  ficha_datos: { label: 'Ficha de datos', badgeClass: 'bg-cyan-50 text-cyan-800 border-cyan-200/60', iconClass: 'text-cyan-700 bg-cyan-50/80 border-cyan-100' },
  matricula_portugues: { label: 'Matrícula portugués', badgeClass: 'bg-teal-50 text-teal-800 border-teal-200/60', iconClass: 'text-teal-700 bg-teal-50/80 border-teal-100' },
};

export const SUBMISSION_TYPES = Object.keys(SUBMISSION_TYPE_META) as FormType[];

/**
 * Tipos gestionados por la base de datos y visibles en el panel administrativo.
 * Staff se registra exclusivamente en Olympus y no forma parte de este panel.
 */
export const ADMIN_SUBMISSION_TYPES = SUBMISSION_TYPES.filter(
  (formType) => formType !== 'staff',
);

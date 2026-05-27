export type FormType =
  | 'contacto'
  | 'soporte'
  | 'reclamaciones'
  | 'alianzas'
  | 'asesor'
  | 'matricula';

export interface Submission {
  id: number;
  form_type: FormType;
  data: Record<string, unknown>;
  created_at: string;
}

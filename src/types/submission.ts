export type FormType =
  | 'contacto'
  | 'soporte'
  | 'reclamaciones'
  | 'alianzas'
  | 'asesor'
  | 'matricula'
  | 'becarios'
  | 'staff'
  | 'reclutamiento_docente'
  | 'registro_docentes'
  | 'ficha_datos'
  | 'matricula_portugues';

export interface Submission {
  id: number;
  form_type: FormType;
  data: Record<string, unknown>;
  created_at: string;
}

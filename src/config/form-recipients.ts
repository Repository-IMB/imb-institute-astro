import type { FormType } from '../types/submission';

type Recipient = { email: string; name?: string };

const recipient = (email: string, name?: string): Recipient => ({ email, name });

/**
 * Enrutamiento confirmado en el inventario de WPForms.
 * Se mantiene fuera de los componentes para que ningún formulario decida a quién notificar.
 */
export const FORM_RECIPIENTS: Partial<Record<FormType, Recipient[]>> = {
  contacto: [recipient('informacion@imbinstitute.com', 'Información IMB'), recipient('eduardomenaa89@gmail.com', 'Eduardo')],
  asesor: [recipient('enmachacara@gmail.com'), recipient('eduardomenaa89@gmail.com', 'Eduardo')],
  matricula: [recipient('admin@imbinstitute.com', 'Administración IMB')],
  becarios: [recipient('becarios@imbinstitute.com', 'Programa de Becarios')],
  soporte: [recipient('academicdir@imbinstitute.com', 'Soporte académico')],
  reclamaciones: [recipient('marketing@imbinstitute.com', 'Marketing IMB'), recipient('brahajan.p.a@gmail.com')],
  alianzas: [recipient('eduardomenaa89@gmail.com', 'Eduardo'), recipient('milagros12loppez@gmail.com', 'Milagros'), recipient('Lourdesallende.cba@gmail.com', 'Lourdes Allende')],
  reclutamiento_docente: [recipient('admin@imbinstitute.com', 'Administración IMB')],
  registro_docentes: [recipient('admin@imbinstitute.com', 'Administración IMB')],
  ficha_datos: [recipient('admin@imbinstitute.com', 'Administración IMB')],
  matricula_portugues: [recipient('admin@imbinstitute.com', 'Administración IMB')],
};

export function getFormRecipients(
  formType: FormType,
  fallback: string,
  forceTo?: string,
): string | Recipient[] {
  const override = forceTo?.trim();

  if (override) return override;

  return FORM_RECIPIENTS[formType] ?? fallback;
}

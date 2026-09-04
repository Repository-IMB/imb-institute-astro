import { describe, expect, it } from 'vitest';
import { FORM_RECIPIENTS, getFormRecipients } from '../../src/config/form-recipients';
import { ADMIN_SUBMISSION_TYPES, SUBMISSION_TYPES } from '../../src/config/submissions';

describe('destinatarios de formularios', () => {
  it.each(SUBMISSION_TYPES)('%s tiene al menos un destinatario configurado', (formType) => {
    const recipients = getFormRecipients(formType, 'fallback@imbinstitute.com');
    const emails = typeof recipients === 'string'
      ? [recipients]
      : recipients.map(({ email }) => email);

    expect(emails.length).toBeGreaterThan(0);
    expect(emails.every((email) => email.includes('@'))).toBe(true);
  });

  it('MAIL_FORCE_TO reemplaza los destinatarios en pruebas o desarrollo', () => {
    expect(getFormRecipients('matricula', 'fallback@imbinstitute.com', 'pruebas@imbinstitute.com'))
      .toBe('pruebas@imbinstitute.com');
  });

  it('ignora un MAIL_FORCE_TO vacío', () => {
    expect(getFormRecipients('matricula', 'fallback@imbinstitute.com', '   '))
      .toEqual(FORM_RECIPIENTS.matricula);
  });

  it('no muestra en administración los formularios gestionados por Olympus', () => {
    expect(ADMIN_SUBMISSION_TYPES).not.toContain('staff');
  });
});

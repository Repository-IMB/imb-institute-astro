import { actions, isInputError } from 'astro:actions';

type ActionResult = {
  error?: {
    message?: string;
    fields?: Record<string, string[]>;
  };
};

type FormAction = (input: FormData) => Promise<ActionResult>;

type SubmissionActionName =
  | 'contacto'
  | 'asesor'
  | 'soporte'
  | 'alianzas'
  | 'reclamaciones'
  | 'staff'
  | 'reclutamientoDocente'
  | 'registroDocentes'
  | 'fichaDatos'
  | 'matriculaPortugues';

const formActions: Record<SubmissionActionName, FormAction> = {
  contacto: actions.contacto as FormAction,
  asesor: actions.asesor as FormAction,
  soporte: actions.soporte as FormAction,
  alianzas: actions.alianzas as FormAction,
  reclamaciones: actions.reclamaciones as FormAction,
  staff: actions.staff as FormAction,
  reclutamientoDocente: actions.reclutamientoDocente as FormAction,
  registroDocentes: actions.registroDocentes as FormAction,
  fichaDatos: actions.fichaDatos as FormAction,
  matriculaPortugues: actions.matriculaPortugues as FormAction,
};

function isSubmissionActionName(value: string): value is SubmissionActionName {
  return value in formActions;
}

function initSubmissionForms() {
  document.querySelectorAll<HTMLFormElement>('[data-submission-form]').forEach((form) => {
    if (form.dataset.initialized) return;
    form.dataset.initialized = 'true';

    const errorEl = document.getElementById(form.dataset.errorId ?? '');
    const errorMsg = document.getElementById(form.dataset.errorMessageId ?? '');
    const successEl = document.getElementById(form.dataset.successId ?? '');
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const buttonText = button?.querySelector<HTMLElement>('.btn-text');
    const spinner = button?.querySelector<HTMLElement>('.btn-spinner');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      errorEl?.classList.add('hidden');
      errorEl?.classList.remove('flex');
      form.querySelectorAll<HTMLElement>('[data-error-for]').forEach((element) => {
        element.textContent = '';
        element.classList.add('hidden');
      });

      if (!form.reportValidity()) return;

      if (button) button.disabled = true;
      if (buttonText) buttonText.textContent = form.dataset.pendingLabel ?? 'Enviando...';
      spinner?.classList.remove('hidden');

      try {
        const actionName = form.dataset.action ?? '';
        if (!isSubmissionActionName(actionName)) {
          throw new Error('El formulario no está configurado correctamente.');
        }

        const result = await formActions[actionName](new FormData(form));
        if (result.error) {
          if (isInputError(result.error as never) && result.error.fields) {
            for (const [field, messages] of Object.entries(result.error.fields)) {
              const fieldError = form.querySelector<HTMLElement>(`[data-error-for="${field}"]`);
              if (fieldError && messages?.[0]) {
                fieldError.textContent = messages[0];
                fieldError.classList.remove('hidden');
              }
            }
            form.querySelector<HTMLElement>('[data-error-for]:not(.hidden)')?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
            return;
          }
          throw new Error(result.error.message || 'No se pudo enviar el formulario.');
        }

        form.classList.add('hidden');
        successEl?.classList.remove('hidden');
        successEl?.classList.add('flex');
        successEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } catch (error) {
        if (errorMsg) {
          errorMsg.textContent = error instanceof Error
            ? error.message
            : 'No se pudo enviar el formulario.';
        }
        errorEl?.classList.remove('hidden');
        errorEl?.classList.add('flex');
      } finally {
        if (button) button.disabled = false;
        if (buttonText) buttonText.textContent = form.dataset.submitLabel ?? 'Enviar';
        spinner?.classList.add('hidden');
      }
    });

    form.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
      if (!target.name) return;
      form.querySelector<HTMLElement>(`[data-error-for="${target.name}"]`)?.classList.add('hidden');
    });
  });
}

document.addEventListener('astro:page-load', initSubmissionForms);
initSubmissionForms();

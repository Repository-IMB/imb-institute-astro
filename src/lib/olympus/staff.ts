const STAFF_APPLICATION_ENDPOINT =
  'https://olympus.imbinstitute.com/api/api/FormularioStaff/Registrar';

export interface StaffApplication {
  nombre_completo: string;
  correo_electronico: string;
  area_postulacion: string;
  cv_pdf: File;
}

function getResponseMessage(responseText: string): string | undefined {
  if (!responseText) return undefined;

  try {
    const data = JSON.parse(responseText) as { mensaje?: unknown; message?: unknown };
    if (typeof data.mensaje === 'string' && data.mensaje.trim()) return data.mensaje;
    if (typeof data.message === 'string' && data.message.trim()) return data.message;
  } catch {
    // Algunas respuestas del servicio no contienen JSON.
  }

  return undefined;
}

/**
 * Registra una postulación en el sistema Olympus utilizado por la página oficial.
 * El archivo se reenvía como multipart/form-data sin convertirlo a base64.
 */
export async function submitStaffApplication(application: StaffApplication): Promise<void> {
  const payload = new FormData();
  payload.append('nombre_completo', application.nombre_completo);
  payload.append('correo_electronico', application.correo_electronico);
  payload.append('area_postulacion', application.area_postulacion);
  payload.append('cv_pdf', application.cv_pdf, application.cv_pdf.name);

  const response = await fetch(STAFF_APPLICATION_ENDPOINT, {
    method: 'POST',
    body: payload,
  });
  const responseText = await response.text().catch(() => '');

  if (!response.ok) {
    throw new Error(
      getResponseMessage(responseText) ??
        `Olympus rechazó la postulación con el estado ${response.status}.`,
    );
  }
}

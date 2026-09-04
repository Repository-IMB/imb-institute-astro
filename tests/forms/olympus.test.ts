import { afterEach, describe, expect, it, vi } from 'vitest';
import { submitStaffApplication } from '../../src/lib/olympus/staff';

describe('integración de postulaciones con Olympus', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('envía los campos y el CV mediante multipart/form-data', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ mensaje: 'Postulación registrada' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    ));
    vi.stubGlobal('fetch', fetchMock);

    const cv = new File(['currículum'], 'cv.pdf', { type: 'application/pdf' });
    await submitStaffApplication({
      nombre_completo: 'María Torres',
      correo_electronico: 'maria@correo.com',
      area_postulacion: 'Growth',
      cv_pdf: cv,
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://olympus.imbinstitute.com/api/api/FormularioStaff/Registrar');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);

    const payload = options.body as FormData;
    expect(payload.get('nombre_completo')).toBe('María Torres');
    expect(payload.get('correo_electronico')).toBe('maria@correo.com');
    expect(payload.get('area_postulacion')).toBe('Growth');
    const uploadedCv = payload.get('cv_pdf');
    expect(uploadedCv).toBeInstanceOf(File);
    expect((uploadedCv as File).name).toBe('cv.pdf');
    expect((uploadedCv as File).type).toBe('application/pdf');
  });

  it('rechaza la operación cuando Olympus responde con error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(
      JSON.stringify({ mensaje: 'No se pudo registrar la postulación.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )));

    await expect(submitStaffApplication({
      nombre_completo: 'María Torres',
      correo_electronico: 'maria@correo.com',
      area_postulacion: 'Growth',
      cv_pdf: new File(['currículum'], 'cv.pdf', { type: 'application/pdf' }),
    })).rejects.toThrow('No se pudo registrar la postulación.');
  });
});

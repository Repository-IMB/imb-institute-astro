import { beforeEach, describe, expect, it, vi } from 'vitest';

const { insertSubmissionMock, sendMailMock, submitStaffApplicationMock } = vi.hoisted(() => ({
  insertSubmissionMock: vi.fn(),
  sendMailMock: vi.fn(),
  submitStaffApplicationMock: vi.fn(),
}));

vi.mock('../../src/lib/db', () => ({ insertSubmission: insertSubmissionMock }));
vi.mock('../../src/lib/email', () => ({ sendMail: sendMailMock }));
vi.mock('../../src/lib/olympus/staff', () => ({
  submitStaffApplication: submitStaffApplicationMock,
}));

import { contacto } from '../../src/actions/contacto';
import { asesor } from '../../src/actions/asesor';
import { matricula } from '../../src/actions/matricula';
import { becarios } from '../../src/actions/becarios';
import { soporte } from '../../src/actions/soporte';
import { reclamaciones } from '../../src/actions/reclamaciones';
import { alianzas } from '../../src/actions/alianzas';
import { staff } from '../../src/actions/staff';
import { reclutamientoDocente } from '../../src/actions/reclutamientoDocente';
import { registroDocentes } from '../../src/actions/registroDocentes';
import { fichaDatos } from '../../src/actions/fichaDatos';
import { matriculaPortugues } from '../../src/actions/matriculaPortugues';
import type { FormType } from '../../src/types/submission';

type FormAction = (input: FormData) => Promise<{
  data?: { success: boolean; id?: number };
  error?: Error;
}>;

interface ActionCase {
  name: string;
  type: FormType;
  action: FormAction;
  values: Record<string, string>;
  files?: Record<string, File[]>;
  destination?: 'imb' | 'olympus';
}

const cases: ActionCase[] = [
  {
    name: 'contacto', type: 'contacto', action: contacto as FormAction,
    values: { nombres: 'María', apellidos: 'Torres', telefono: '+51932329714', correo: 'maria@correo.com', consulta: 'Deseo recibir información sobre los cursos.' },
  },
  {
    name: 'asesor', type: 'asesor', action: asesor as FormAction,
    values: { nombres: 'María Torres', telefono: '+51932329714', correo: 'maria@correo.com', cursoNombre: 'Gestión de calidad' },
  },
  {
    name: 'matrícula en español', type: 'matricula', action: matricula as FormAction,
    values: { curso: 'Gestión de calidad', nombres: 'María Torres', documento: 'DNI 12345678', pais: 'Perú', correo: 'maria@correo.com', whatsapp: '+51932329714', formacion: 'Ingeniería', empresa: 'Empresa SAC', cargo: 'Supervisora', familiaridad_tecnologica: 'Intermedio (uso habitual de herramientas digitales)', tipo_comprobante: 'Boleta', razon_social: 'María Torres', numero_tributario: '12345678901', nivel_ingles: 'Básico', nivel_excel: 'Avanzado', terminos: 'on' },
  },
  {
    name: 'programa de becarios', type: 'becarios', action: becarios as FormAction,
    values: { nombres: 'María', apellidos: 'Torres', documento: '12345678', fecha_nacimiento: '2000-05-10', correo: 'maria@correo.com', whatsapp: '+51932329714', universidad: 'Universidad Nacional', carrera: 'Administración', ciclo: '8vo Ciclo', asociacion: 'Capítulo estudiantil', horario_semana: 'Tarde', horario_finde: 'Mañana', motivacion: 'Deseo desarrollar experiencia profesional aplicada.' },
    files: { documentos: [new File(['contenido'], 'constancia.pdf', { type: 'application/pdf' })] },
  },
  {
    name: 'soporte académico', type: 'soporte', action: soporte as FormAction,
    values: { nombres: 'María Torres', correo: 'maria@correo.com', telefono: '+51932329714', curso: 'Gestión de calidad', categoria: 'Problemas con el Aula Virtual (no carga, no se ve)', mensaje: 'No puedo acceder al contenido de la segunda sesión.', terminos: 'on', estado: 'Pendiente' },
  },
  {
    name: 'libro de reclamaciones', type: 'reclamaciones', action: reclamaciones as FormAction,
    values: { fecha: '2026-09-01', nombres: 'María Torres', documento: '12345678', telefono: '+51932329714', correo: 'maria@correo.com', direccion: 'Av. Principal 123', ciudad: 'Lima', region: 'Lima', codigo_postal: '15001', pais: 'Perú', tipoBien: 'Servicio', detalleBien: 'Curso de gestión de calidad', montoReclamado: '350', descripcionBien: 'Programa de capacitación contratado en línea.', tipoSolicitud: 'Reclamo', detalleReclamo: 'Solicito la revisión de la información proporcionada.', pedido: 'Solicito una respuesta formal sobre el caso.', privacidad: 'on' },
  },
  {
    name: 'alianzas', type: 'alianzas', action: alianzas as FormAction,
    values: { empresa: 'Organización Aliada', tipoAlianza: 'Capacitación', sector: 'Educación', correo: 'contacto@empresa.com', telefono: '+51932329714', descripcion: 'Buscamos desarrollar un programa para nuestro equipo.' },
  },
  {
    name: 'staff IMB', type: 'staff', action: staff as FormAction,
    values: { nombre_completo: 'María Torres', correo_electronico: 'maria@correo.com', area_postulacion: 'Growth' },
    files: { cv_pdf: [new File(['currículum'], 'cv.pdf', { type: 'application/pdf' })] },
    destination: 'olympus',
  },
  {
    name: 'reclutamiento docente', type: 'reclutamiento_docente', action: reclutamientoDocente as FormAction,
    values: { nombre: 'María Torres', correo: 'maria@correo.com', direccion: 'Av. Principal 123', ciudad: 'Lima', region: 'Lima', codigo_postal: '15001', pais: 'Perú', linkedin: 'https://linkedin.com/in/maria', especialidad: 'Calidad', experiencia_profesional: 'Diez años de experiencia.', experiencia_docente: 'Cinco años de docencia.', habilidades_certificaciones: 'ISO 9001', disponibilidad: 'Lunes por la tarde', comentarios: '', aceptacion_datos: 'Acepto' },
    files: { cv_pdf: [new File(['currículum'], 'cv.pdf', { type: 'application/pdf' })] },
  },
  {
    name: 'registro de docentes', type: 'registro_docentes', action: registroDocentes as FormAction,
    values: { nombre: 'María Torres', documento: 'DNI 12345678', correo: 'maria@correo.com', telefono: '+51932329714', direccion: 'Av. Principal 123', ciudad: 'Lima', region: 'Lima', codigo_postal: '15001', pais: 'Perú', grado_academico: 'Maestría', experiencia_decisiones: 'Jefatura de operaciones', experiencia_docente: 'Docencia universitaria' },
    files: { foto_personal: [new File(['foto'], 'foto.jpg', { type: 'image/jpeg' })], cv_documentado: [new File(['currículum'], 'cv.pdf', { type: 'application/pdf' })] },
  },
  {
    name: 'ficha de datos', type: 'ficha_datos', action: fichaDatos as FormAction,
    values: { nombre: 'María Torres', fecha_nacimiento: '1998-05-10', dni: '12345678', correo: 'maria@correo.com', celular: '+51932329714', fecha_inicio: '2026-09-01', puesto: 'Asistente académica', turno: 'Turno mañana', direccion: 'Av. Principal 123', ciudad: 'Lima', region: 'Lima', codigo_postal: '15001', pais: 'Perú', contacto_referencia: 'Carlos Torres, +51900000000', area_formacion: 'Administración', nivel_formacion: 'Universitario', centro_estudios: 'Universidad Nacional', entidad_bancaria: 'Banco de prueba', numero_cuenta: '00123456789' },
  },
  {
    name: 'matrícula en portugués', type: 'matricula_portugues', action: matriculaPortugues as FormAction,
    values: { programa: 'Gestão da qualidade', nome: 'Mariana Silva', documento: 'RG 12345678', data_nascimento: '1995-04-12', familiaridade_tecnologica: 'Intermediário', email: 'mariana@email.com', whatsapp: '+5511999999999', pais: 'Brasil', area_formacao: 'Engenharia', empresa: 'Empresa Brasileira', cargo: 'Supervisora', faturamento: 'Nota Fiscal', razao_social: 'Mariana Silva', numero_faturamento: '12345678900' },
  },
];

function createFormData({ values, files }: ActionCase): FormData {
  const formData = new FormData();
  for (const [name, value] of Object.entries(values)) formData.append(name, value);
  for (const [name, entries] of Object.entries(files ?? {})) {
    for (const file of entries) formData.append(name, file);
  }
  return formData;
}

function bindAction(action: FormAction, formData: FormData): FormAction {
  const request = new Request('http://localhost:4321/formulario', { method: 'POST', body: formData });
  const context = {
    request,
    url: new URL(request.url),
    locals: {},
    [Symbol.for('astro.actionAPIContext')]: true,
  };
  return action.bind(context);
}

describe.each(cases)('Astro Action: $name', (testCase) => {
  beforeEach(() => {
    insertSubmissionMock.mockReset().mockResolvedValue(101);
    sendMailMock.mockReset().mockResolvedValue({ success: true, messageId: 'brevo-test-id' });
    submitStaffApplicationMock.mockReset().mockResolvedValue(undefined);
  });

  it('valida y envía al sistema configurado', async () => {
    const formData = createFormData(testCase);
    const action = bindAction(testCase.action, formData);
    const result = await action(formData);

    expect(result.error).toBeUndefined();

    if (testCase.destination === 'olympus') {
      expect(result.data).toEqual({ success: true });
      expect(submitStaffApplicationMock).toHaveBeenCalledWith(expect.objectContaining({
        nombre_completo: testCase.values.nombre_completo,
        correo_electronico: testCase.values.correo_electronico,
        area_postulacion: testCase.values.area_postulacion,
        cv_pdf: expect.any(File),
      }));
      expect(insertSubmissionMock).not.toHaveBeenCalled();
      expect(sendMailMock).not.toHaveBeenCalled();
      return;
    }

    expect(result.data).toEqual({ success: true, id: 101 });
    expect(insertSubmissionMock).toHaveBeenCalledWith(expect.anything(), testCase.type, expect.any(Object));
    expect(sendMailMock).toHaveBeenCalled();
  });
});

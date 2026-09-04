import { describe, expect, it } from 'vitest';
import type { ZodType } from 'astro/zod';
import { asesorSchema } from '../../src/actions/validation/asesor';
import { contactoSchema } from '../../src/actions/validation/contacto';
import { matriculaSchema } from '../../src/actions/validation/matricula';
import { becariosSchema } from '../../src/actions/validation/becarios';
import { soporteSchema } from '../../src/actions/validation/soporte';
import { reclamacionesSchema } from '../../src/actions/validation/reclamaciones';
import { alianzasSchema } from '../../src/actions/validation/alianzas';
import { staffSchema } from '../../src/actions/validation/staff';
import { reclutamientoDocenteSchema } from '../../src/actions/validation/reclutamientoDocente';
import { registroDocentesSchema } from '../../src/actions/validation/registroDocentes';
import { fichaDatosSchema } from '../../src/actions/validation/fichaDatos';
import { matriculaPortuguesSchema } from '../../src/actions/validation/matriculaPortugues';

interface FormValidationCase {
  name: string;
  schema: ZodType;
  valid: Record<string, unknown>;
  requiredField: string;
  emailField: string;
}

const forms: FormValidationCase[] = [
  {
    name: 'contacto',
    schema: contactoSchema,
    requiredField: 'nombres',
    emailField: 'correo',
    valid: {
      nombres: 'María',
      apellidos: 'Torres',
      telefono: '+51932329714',
      correo: 'maria.torres@correo.com',
      consulta: 'Deseo conocer los próximos programas disponibles.',
    },
  },
  {
    name: 'asesor',
    schema: asesorSchema,
    requiredField: 'nombres',
    emailField: 'correo',
    valid: {
      nombres: 'María Torres',
      telefono: '+51932329714',
      correo: 'maria.torres@correo.com',
      cursoNombre: 'Gestión de calidad',
    },
  },
  {
    name: 'matrícula en español',
    schema: matriculaSchema,
    requiredField: 'curso',
    emailField: 'correo',
    valid: {
      curso: 'Gestión de calidad',
      nombres: 'María Torres',
      documento: 'DNI 12345678',
      pais: 'Perú',
      correo: 'maria.torres@correo.com',
      whatsapp: '+51932329714',
      formacion: 'Ingeniería industrial',
      empresa: 'Industrias del Perú',
      cargo: 'Supervisora',
      familiaridad_tecnologica: 'Intermedio (uso habitual de herramientas digitales)',
      tipo_comprobante: 'Boleta',
      razon_social: 'María Torres',
      numero_tributario: '12345678901',
      nivel_ingles: 'Básico',
      nivel_excel: 'Avanzado',
      terminos: 'on',
    },
  },
  {
    name: 'programa de becarios',
    schema: becariosSchema,
    requiredField: 'documento',
    emailField: 'correo',
    valid: {
      nombres: 'María',
      apellidos: 'Torres',
      documento: '12345678',
      fecha_nacimiento: '2000-05-10',
      correo: 'maria.torres@correo.com',
      whatsapp: '+51932329714',
      universidad: 'Universidad Nacional',
      carrera: 'Administración',
      ciclo: '8vo Ciclo',
      asociacion: 'Capítulo estudiantil',
      motivacion: 'Deseo desarrollar experiencia profesional aplicada.',
    },
  },
  {
    name: 'soporte académico',
    schema: soporteSchema,
    requiredField: 'mensaje',
    emailField: 'correo',
    valid: {
      nombres: 'María Torres',
      correo: 'maria.torres@correo.com',
      telefono: '+51932329714',
      curso: 'Gestión de calidad',
      categoria: 'Problemas con el Aula Virtual (no carga, no se ve)',
      mensaje: 'No puedo acceder al contenido de la segunda sesión.',
      terminos: 'on',
      estado: 'Pendiente',
    },
  },
  {
    name: 'libro de reclamaciones',
    schema: reclamacionesSchema,
    requiredField: 'detalleReclamo',
    emailField: 'correo',
    valid: {
      fecha: '2026-09-01',
      nombres: 'María Torres',
      documento: '12345678',
      telefono: '+51932329714',
      correo: 'maria.torres@correo.com',
      direccion: 'Av. Principal 123',
      ciudad: 'Lima',
      region: 'Lima',
      codigo_postal: '15001',
      pais: 'Perú',
      tipoBien: 'Servicio',
      detalleBien: 'Curso de gestión de calidad',
      montoReclamado: '350',
      descripcionBien: 'Programa de capacitación contratado en línea.',
      tipoSolicitud: 'Reclamo',
      detalleReclamo: 'Solicito la revisión de la información proporcionada.',
      pedido: 'Solicito una respuesta formal sobre el caso.',
      privacidad: 'on',
    },
  },
  {
    name: 'alianzas',
    schema: alianzasSchema,
    requiredField: 'empresa',
    emailField: 'correo',
    valid: {
      empresa: 'Organización Aliada',
      tipoAlianza: 'Capacitación corporativa',
      sector: 'Educación',
      correo: 'contacto@empresa.com',
      telefono: '+51932329714',
      descripcion: 'Buscamos desarrollar un programa para nuestro equipo.',
    },
  },
  {
    name: 'staff IMB',
    schema: staffSchema,
    requiredField: 'area_postulacion',
    emailField: 'correo_electronico',
    valid: {
      nombre_completo: 'María Torres',
      correo_electronico: 'maria.torres@correo.com',
      area_postulacion: 'Growth',
    },
  },
  {
    name: 'reclutamiento docente',
    schema: reclutamientoDocenteSchema,
    requiredField: 'especialidad',
    emailField: 'correo',
    valid: {
      nombre: 'María Torres',
      correo: 'maria.torres@correo.com',
      direccion: 'Av. Principal 123',
      ciudad: 'Lima',
      region: 'Lima',
      codigo_postal: '15001',
      pais: 'Perú',
      linkedin: 'https://www.linkedin.com/in/maria-torres',
      especialidad: 'Calidad',
      experiencia_profesional: 'Diez años de experiencia profesional.',
      experiencia_docente: 'Cinco años de experiencia docente.',
      habilidades_certificaciones: 'ISO 9001 y gestión de procesos.',
      disponibilidad: 'Lunes y miércoles por la tarde',
      comentarios: '',
    },
  },
  {
    name: 'registro de docentes',
    schema: registroDocentesSchema,
    requiredField: 'documento',
    emailField: 'correo',
    valid: {
      nombre: 'María Torres',
      documento: 'DNI 12345678',
      correo: 'maria.torres@correo.com',
      telefono: '+51932329714',
      direccion: 'Av. Principal 123',
      ciudad: 'Lima',
      region: 'Lima',
      codigo_postal: '15001',
      pais: 'Perú',
      grado_academico: 'Maestría',
      experiencia_decisiones: 'Jefatura de operaciones.',
      experiencia_docente: 'Docencia universitaria.',
    },
  },
  {
    name: 'ficha de datos',
    schema: fichaDatosSchema,
    requiredField: 'dni',
    emailField: 'correo',
    valid: {
      nombre: 'María Torres',
      fecha_nacimiento: '1998-05-10',
      dni: '12345678',
      correo: 'maria.torres@correo.com',
      celular: '+51932329714',
      fecha_inicio: '2026-09-01',
      puesto: 'Asistente académica',
      turno: 'Turno mañana',
      direccion: 'Av. Principal 123',
      ciudad: 'Lima',
      region: 'Lima',
      codigo_postal: '15001',
      pais: 'Perú',
      contacto_referencia: 'Carlos Torres, +51900000000',
      area_formacion: 'Administración',
      nivel_formacion: 'Universitario',
      centro_estudios: 'Universidad Nacional',
      entidad_bancaria: 'Banco de prueba',
      numero_cuenta: '00123456789',
    },
  },
  {
    name: 'matrícula en portugués',
    schema: matriculaPortuguesSchema,
    requiredField: 'programa',
    emailField: 'email',
    valid: {
      programa: 'Gestão da qualidade',
      nome: 'Mariana Silva',
      documento: 'RG 12345678',
      data_nascimento: '1995-04-12',
      familiaridade_tecnologica: 'Intermediário',
      email: 'mariana.silva@email.com',
      whatsapp: '+5511999999999',
      pais: 'Brasil',
      area_formacao: 'Engenharia',
      empresa: 'Empresa Brasileira',
      cargo: 'Supervisora',
      faturamento: 'Nota Fiscal',
      razao_social: 'Mariana Silva',
      numero_faturamento: '12345678900',
    },
  },
];

describe.each(forms)('validación: $name', ({ schema, valid, requiredField, emailField }) => {
  it('acepta una respuesta completa y válida', () => {
    expect(schema.safeParse(valid).success).toBe(true);
  });

  it(`rechaza la respuesta cuando falta ${requiredField}`, () => {
    const invalid = { ...valid };
    delete invalid[requiredField];
    expect(schema.safeParse(invalid).success).toBe(false);
  });

  it('rechaza un correo con formato inválido', () => {
    expect(schema.safeParse({ ...valid, [emailField]: 'correo-invalido' }).success).toBe(false);
  });
});

describe('reglas específicas de matrícula', () => {
  it('rechaza documentos y datos tributarios mayores de 25 caracteres', () => {
    const base = forms.find((form) => form.name === 'matrícula en español')!.valid;
    const tooLong = 'x'.repeat(26);

    expect(matriculaSchema.safeParse({ ...base, documento: tooLong }).success).toBe(false);
    expect(matriculaSchema.safeParse({ ...base, razon_social: tooLong }).success).toBe(false);
    expect(matriculaSchema.safeParse({ ...base, numero_tributario: tooLong }).success).toBe(false);
  });

  it('solo acepta las opciones definidas y los términos marcados', () => {
    const base = forms.find((form) => form.name === 'matrícula en español')!.valid;

    expect(matriculaSchema.safeParse({ ...base, familiaridad_tecnologica: 'Experto' }).success).toBe(false);
    expect(matriculaSchema.safeParse({ ...base, tipo_comprobante: 'Otro' }).success).toBe(false);
    expect(matriculaSchema.safeParse({ ...base, terminos: 'off' }).success).toBe(false);
  });
});

describe('reglas específicas de los formularios actualizados', () => {
  it('exige la consulta en el formulario de contacto', () => {
    const base = forms.find((form) => form.name === 'contacto')!.valid;
    expect(contactoSchema.safeParse({ ...base, consulta: undefined }).success).toBe(false);
  });

  it('exige teléfono y descripción en alianzas', () => {
    const base = forms.find((form) => form.name === 'alianzas')!.valid;
    expect(alianzasSchema.safeParse({ ...base, telefono: undefined }).success).toBe(false);
    expect(alianzasSchema.safeParse({ ...base, descripcion: undefined }).success).toBe(false);
  });

  it('solo acepta el estado inicial Pendiente en soporte', () => {
    const base = forms.find((form) => form.name === 'soporte académico')!.valid;
    expect(soporteSchema.safeParse({ ...base, estado: 'Resuelto' }).success).toBe(false);
  });

  it('exige los datos del bien, el pedido y la autorización en reclamaciones', () => {
    const base = forms.find((form) => form.name === 'libro de reclamaciones')!.valid;
    expect(reclamacionesSchema.safeParse({ ...base, descripcionBien: undefined }).success).toBe(false);
    expect(reclamacionesSchema.safeParse({ ...base, pedido: undefined }).success).toBe(false);
    expect(reclamacionesSchema.safeParse({ ...base, privacidad: undefined }).success).toBe(false);
  });

  it('solo acepta los ciclos disponibles del Programa de Becarios', () => {
    const base = forms.find((form) => form.name === 'programa de becarios')!.valid;
    expect(becariosSchema.safeParse({ ...base, ciclo: 'Egresado' }).success).toBe(false);
    expect(becariosSchema.safeParse({ ...base, ciclo: '12vo Ciclo' }).success).toBe(true);
  });
});

export interface Curso {
  slug: string;
  nombre: string;
  categoria: string;
  instructor: string;
  duracion: string;
  nivel: string;
  modalidad: string;
  certificacion: string;
  imagen: string;
  descripcion: string;
  modulos: Array<{
    titulo: string;
    items: string[];
  }>;
}

export const cursos: Curso[] = [
  {
    slug: 'gestion-mantenimiento-industrial',
    nombre: 'Diplomado en Gestión de Mantenimiento Industrial',
    categoria: 'Mantenimiento',
    instructor: 'Ing. Yassín Vázquez',
    duracion: '120 Horas',
    nivel: 'Avanzado',
    modalidad: 'Online en Vivo',
    certificacion: 'Diploma Oficial',
    imagen: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    descripcion: 'Optimiza la disponibilidad de los activos, reduce costos operativos y lidera la transformación hacia el mantenimiento predictivo 4.0. En el entorno industrial actual, la gestión del mantenimiento ha dejado de ser un centro de costos para convertirse en un área estratégica que genera valor.',
    modulos: [
      {
        titulo: 'Módulo I: Fundamentos y Estrategia de Mantenimiento',
        items: [
          'Evolución del mantenimiento industrial.',
          'Definición de KPIs y métricas clave.',
          'Tipos de mantenimiento: correctivo, preventivo, predictivo.',
          'Gestión de activos físicos (ISO 55000).'
        ]
      },
      {
        titulo: 'Módulo II: Mantenimiento Preventivo y Predictivo',
        items: [
          'Diseño de planes preventivos.',
          'Análisis de vibraciones.',
          'Termografía y análisis de aceite.',
          'Introducción a Industry 4.0 en mantenimiento.'
        ]
      },
      {
        titulo: 'Módulo III: Gestión de Repuestos y Logística',
        items: [
          'Control de inventarios de repuestos críticos.',
          'Análisis ABC y curvas de demanda.',
          'Relación con el área de compras y abastecimiento.'
        ]
      }
    ]
  },
  {
    slug: 'logistica-supply-chain',
    nombre: 'Especialización en Logística y Supply Chain',
    categoria: 'Logística',
    instructor: 'Mg. Elena Villalobos',
    duracion: '90 Horas',
    nivel: 'Intermedio',
    modalidad: 'Online en Vivo',
    certificacion: 'Diploma Oficial',
    imagen: 'https://images.unsplash.com/photo-1586528116311-ad8ed3c84a0c?auto=format&fit=crop&q=80&w=800',
    descripcion: 'Domina las estrategias de gestión de la cadena de suministro, desde la planificación de la demanda hasta la distribución final. Aprende a optimizar procesos logísticos y reducir costos operativos en toda la cadena de valor.',
    modulos: [
      {
        titulo: 'Módulo I: Fundamentos de Supply Chain',
        items: [
          'Introducción a la cadena de suministro.',
          'Flujo de materiales, información y financiamiento.',
          'Métricas y KPIs logísticos.'
        ]
      },
      {
        titulo: 'Módulo II: Planificación de la Demanda',
        items: [
          'Métodos de pronóstico de demanda.',
          'S&OP (Sales and Operations Planning).',
          'Gestión de inventarios y stock de seguridad.'
        ]
      }
    ]
  },
  {
    slug: 'gestion-recursos-humanos',
    nombre: 'Gestión Estratégica de Recursos Humanos',
    categoria: 'Recursos Humanos',
    instructor: 'Dr. Roberto Santos',
    duracion: '100 Horas',
    nivel: 'Experto',
    modalidad: 'Online en Vivo',
    certificacion: 'Diploma Oficial',
    imagen: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    descripcion: 'Atrae, desarrolla y retiene el mejor talento. Conoce las últimas tendencias en gestión de personas, clima laboral y compensaciones. Diseña estrategias de RRHH alineadas a los objetivos de negocio.',
    modulos: [
      {
        titulo: 'Módulo I: Estrategia de Talento Humano',
        items: [
          'Planificación estratégica de RRHH.',
          'Alineación entre estrategia de negocio y personas.',
          'Employer branding y experiencia del empleado.'
        ]
      },
      {
        titulo: 'Módulo II: Gestión del Desempeño',
        items: [
          'Diseño de sistemas de evaluación de desempeño.',
          'Feedback y conversaciones de desarrollo.',
          'Planes de carrera y sucesión.'
        ]
      }
    ]
  },
  {
    slug: 'analisis-datos-negocios',
    nombre: 'Análisis de Datos para la Toma de Decisiones',
    categoria: 'Tecnología',
    instructor: 'Ing. Carlos Díaz',
    duracion: '80 Horas',
    nivel: 'Intermedio',
    modalidad: 'Online en Vivo',
    certificacion: 'Diploma Oficial',
    imagen: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    descripcion: 'Transforma datos en decisiones estratégicas. Aprende a utilizar herramientas de BI para identificar oportunidades y mejorar la rentabilidad. Desarrolla habilidades en análisis descriptivo, predictivo y prescriptivo.',
    modulos: [
      {
        titulo: 'Módulo I: Fundamentos de Análisis de Datos',
        items: [
          'Ciclo de vida del análisis de datos.',
          'Tipos de análisis: descriptivo, diagnóstico, predictivo.',
          'Herramientas y ecosistema de datos.'
        ]
      },
      {
        titulo: 'Módulo II: Visualización y Dashboards',
        items: [
          'Principios de visualización efectiva.',
          'Diseño de dashboards con Power BI.',
          'Storytelling con datos.'
        ]
      }
    ]
  }
];

export const categorias = ['Todos', 'Mantenimiento', 'Logística', 'Recursos Humanos', 'Tecnología'];

export function getCursoBySlug(slug: string): Curso | undefined {
  return cursos.find(c => c.slug === slug);
}

import { buildEmailBase } from '../base';

export interface ContactoEmailData {
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  consulta?: string;
}

export function buildContactoEmail(data: ContactoEmailData) {
  const fullName = `${data.nombres} ${data.apellidos}`;

  return buildEmailBase({
    subject: `Nueva consulta de contacto — ${fullName}`,
    title: 'Nueva Consulta de Contacto',
    description:
      'Se ha recibido un nuevo mensaje a través del formulario de contacto del sitio web. A continuación encontrarás los datos del solicitante.',
    rows: [
      { label: 'Nombre completo', value: fullName },
      { label: 'Correo electrónico', value: data.correo },
      { label: 'Teléfono / WhatsApp', value: data.telefono },
      ...(data.consulta ? [{ label: 'Consulta', value: data.consulta, isLong: true }] : []),
    ],
    replyTo: data.correo,
    replyName: data.nombres,
  });
}

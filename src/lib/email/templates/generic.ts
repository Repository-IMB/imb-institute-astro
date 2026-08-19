import { buildEmailBase } from '../base';

export function buildGenericEmail(formName: string, data: Record<string, any>) {
  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const rows = Object.entries(data).map(([key, value]) => {
    // Si el valor es un objeto (ej. archivos subidos), lo convertimos a string
    const stringValue = typeof value === 'object' && value !== null 
      ? JSON.stringify(value, null, 2) 
      : String(value || 'N/A');
      
    const isLong = stringValue.length > 50 || stringValue.includes('\n');
    return { label: formatLabel(key), value: stringValue, isLong };
  });

  const subjectName = data.nombres || data.nombre_completo || data.empresa || 'Nuevo Usuario';
  const replyTo = data.correo || data.correo_electronico;

  return buildEmailBase({
    subject: `Nuevo registro en ${formatLabel(formName)} — ${subjectName}`,
    title: `Nuevo Registro: ${formatLabel(formName)}`,
    description: `Se ha recibido un nuevo envío a través del formulario de ${formatLabel(formName)}.`,
    rows,
    replyTo: replyTo,
    replyName: subjectName,
  });
}

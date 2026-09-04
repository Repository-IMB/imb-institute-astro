/**
 * ARCHIVO DE DISEÑO Y MAQUETACIÓN (template.ts)
 * --------------------------------------------
 * Este archivo se encarga EXCLUSIVAMENTE de transformar los datos de cualquier formulario
 * en un correo HTML limpio, minimalista y profesional.
 * No envía correos, solo genera el texto HTML.
 */

const BRAND_COLOR = '#841822';

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface EmailRow {
  label: string;
  value: string;
  /** Si true, la celda de valor ocupa toda la fila abajo del label (para textos largos) */
  isLong?: boolean;
}

export interface EmailBaseOptions {
  title: string;
  description: string;
  rows: EmailRow[];
  replyTo: string;
  replyName: string;
  subject: string;
}

export function buildEmailBase(opts: EmailBaseOptions): {
  subject: string;
  htmlContent: string;
  textContent: string;
} {
  const tableRows = opts.rows
    .map((row) => {
      if (row.isLong) {
        return `
        <tr>
          <td colspan="2" style="padding:16px 0 4px;font-size:12px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">
            ${escapeHtml(row.label)}
          </td>
        </tr>
        <tr>
          <td colspan="2" style="padding:0 0 16px;font-size:15px;color:#111827;line-height:1.6;white-space:pre-wrap;border-bottom:1px solid #e5e7eb;">
            ${escapeHtml(row.value)}
          </td>
        </tr>`;
      }
      return `
        <tr>
          <td style="padding:16px 0;font-size:14px;color:#6b7280;border-bottom:1px solid #e5e7eb;width:35%;">${escapeHtml(row.label)}</td>
          <td style="padding:16px 0;font-size:15px;color:#111827;font-weight:500;border-bottom:1px solid #e5e7eb;">${escapeHtml(row.value)}</td>
        </tr>`;
    })
    .join('');

  const textRows = opts.rows
    .map((row) => `${row.label}: ${row.value}`)
    .join('\n\n');

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(opts.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,Cantarell,'Open Sans','Helvetica Neue',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#ffffff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:24px;border-bottom:2px solid ${BRAND_COLOR};">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND_COLOR};">IMB Institute</p>
              <h1 style="margin:12px 0 0;font-size:24px;font-weight:700;color:#111827;line-height:1.3;">${escapeHtml(opts.title)}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 0;">
              <p style="margin:0 0 32px;font-size:15px;color:#4b5563;line-height:1.6;">
                ${escapeHtml(opts.description)}
              </p>

              <!-- Data table -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${tableRows}
              </table>

              <!-- CTA -->
              <div style="margin-top:40px;text-align:left;">
                <a
                  href="mailto:${encodeURIComponent(opts.replyTo)}?subject=${encodeURIComponent(`Re: ${opts.subject}`)}"
                  style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:6px;text-decoration:none;"
                >
                  Responder a ${escapeHtml(opts.replyName)}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:32px;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:12px;color:#9ca3af;line-height:1.6;">
                Este correo fue generado automáticamente por el sistema de IMB Institute.<br/>
                Por favor no respondas directamente a este buzón automatizado.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();

  const textContent = `
${opts.title}

${textRows}

---
Responder a: ${opts.replyTo}
Este correo fue generado automáticamente por el sistema de IMB Institute.
  `.trim();

  return { subject: opts.subject, htmlContent, textContent };
}

export function buildEmail(formName: string, data: Record<string, any>) {
  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  const rows = Object.entries(data).map(([key, value]) => {
    let stringValue = '';
    
    if (Array.isArray(value) && value.length > 0 && value[0]?.name && value[0]?.size !== undefined) {
      stringValue = value.map(f => `• ${f.name} (${Math.round(f.size / 1024)} KB)`).join('\n');
    }
    else if (Array.isArray(value)) {
      stringValue = value.length > 0 ? value.map((item) => `• ${String(item)}`).join('\n') : 'N/A';
    } 
    else if (typeof value === 'object' && value !== null && value.name && value.size !== undefined) {
      stringValue = `• ${value.name} (${Math.round(value.size / 1024)} KB)`;
    }
    else if (typeof value === 'object' && value !== null) {
      stringValue = JSON.stringify(value, null, 2);
    } 
    else {
      stringValue = String(value || 'N/A');
      
      if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
        const [y, m, d] = stringValue.split('-');
        stringValue = `${d}-${m}-${y}`;
      }
    }
      
    const isLong = stringValue.length > 50 || stringValue.includes('\n');
    return { label: formatLabel(key), value: stringValue, isLong };
  });

  const subjectName = data.nombres || data.nombre || data.nome || data.nombre_completo || data.responsable || data.empresa || data.institucion || 'Nuevo registro';
  const replyTo = data.correo || data.email || data.correo_electronico || data.correo_corporativo || data.correo_contacto || 'no-reply@imbinstitute.com';

  return buildEmailBase({
    subject: `Nuevo registro en ${formatLabel(formName)} — ${subjectName}`,
    title: `Nuevo Registro: ${formatLabel(formName)}`,
    description: `Se ha recibido un nuevo envío a través del formulario de ${formatLabel(formName)}.`,
    rows,
    replyTo: replyTo,
    replyName: subjectName,
  });
}

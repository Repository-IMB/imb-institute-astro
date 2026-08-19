/**
 * Layout base reutilizable para todos los correos de notificación interna de IMB Institute.
 * Cada template de formulario solo necesita proveer los datos específicos y llamar a buildEmailBase().
 */

const BRAND_COLOR = '#841822';
const BRAND_COLOR_DARK = '#6a1019';

export interface EmailRow {
  label: string;
  value: string;
  /** Si true, la celda de valor ocupa toda la fila abajo del label (para textos largos) */
  isLong?: boolean;
}

export interface EmailBaseOptions {
  /** Título en el header del correo (ej: "Nueva Consulta de Contacto") */
  title: string;
  /** Texto de descripción que aparece sobre la tabla de datos */
  description: string;
  /** Filas de datos a mostrar en la tabla */
  rows: EmailRow[];
  /** Email al que apunta el botón "Responder" */
  replyTo: string;
  /** Nombre que aparece en el botón (ej: "Carlos") */
  replyName: string;
  /** Asunto del correo */
  subject: string;
}

export function buildEmailBase(opts: EmailBaseOptions): {
  subject: string;
  htmlContent: string;
  textContent: string;
} {
  const tableRows = opts.rows
    .map((row, i) => {
      const bg = i % 2 === 0 ? '#ffffff' : '#fafafa';
      if (row.isLong) {
        return `
        <tr style="background-color:${bg};">
          <td colspan="2" style="padding:14px 20px;font-size:13px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;">
            ${row.label}
          </td>
        </tr>
        <tr style="background-color:${bg};">
          <td colspan="2" style="padding:0 20px 14px;font-size:14px;color:#374151;line-height:1.65;white-space:pre-wrap;border-bottom:1px solid #f3f4f6;">
            ${row.value}
          </td>
        </tr>`;
      }
      return `
        <tr style="background-color:${bg};">
          <td style="padding:14px 20px;font-size:13px;font-weight:600;color:#374151;border-bottom:1px solid #f3f4f6;width:36%;">${row.label}</td>
          <td style="padding:14px 20px;font-size:14px;color:#111827;font-weight:500;border-bottom:1px solid #f3f4f6;">${row.value}</td>
        </tr>`;
    })
    .join('');

  const textRows = opts.rows
    .map((row) => `${row.label.padEnd(20)}: ${row.value}`)
    .join('\n');

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${opts.subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f5f7;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND_COLOR};padding:28px 40px;">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.65);">IMB Institute</p>
              <h1 style="margin:6px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">${opts.title}</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.65;">
                ${opts.description}
              </p>

              <!-- Data table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
                <tr style="background-color:#f9fafb;">
                  <td style="padding:12px 20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #e5e7eb;width:36%;">Campo</td>
                  <td style="padding:12px 20px;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#9ca3af;border-bottom:1px solid #e5e7eb;">Valor</td>
                </tr>
                ${tableRows}
              </table>

              <!-- CTA -->
              <div style="margin-top:28px;text-align:center;">
                <a
                  href="mailto:${opts.replyTo}?subject=Re: ${opts.subject}"
                  style="display:inline-block;background-color:${BRAND_COLOR};color:#ffffff;font-size:14px;font-weight:700;padding:14px 32px;border-radius:8px;text-decoration:none;letter-spacing:0.3px;"
                >
                  Responder a ${opts.replyName}
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;">
                Este correo fue generado automáticamente por el sistema de IMB Institute.<br/>
                Por favor no respondas directamente a este mensaje.
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
${opts.title.toUpperCase()} — IMB Institute
${'='.repeat(opts.title.length + 18)}

${textRows}

---
Mensaje generado automáticamente por el sitio web de IMB Institute.
  `.trim();

  return { subject: opts.subject, htmlContent, textContent };
}

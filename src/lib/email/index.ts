/**
 * ARCHIVO DE ENVÍO DE CORREOS (index.ts)
 * --------------------------------------
 * Este archivo es el "Cartero". Su única función es tomar el correo HTML generado 
 * por template.ts y enviarlo a través de la API (Gateway) de la empresa.
 */
import { env } from 'cloudflare:workers';

export interface SendMailOptions {
  from: string;
  to: string | { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  tag?: string;
  attachment?: { name: string; content?: string; url?: string }[];
}

export interface MailGatewayResponse {
  success: true;
  messageId: string;
}

/**
 * Envía un correo a través del Mail Gateway centralizado de la empresa.
 * Lee MAIL_GATEWAY_URL y MAIL_GATEWAY_TOKEN desde las variables de entorno de Cloudflare.
 * Considera correcto el envío cuando el gateway confirma que Brevo aceptó
 * la solicitud y devuelve su identificador de mensaje.
 */
export async function sendMail(options: SendMailOptions): Promise<MailGatewayResponse> {
  const gatewayUrl = env.MAIL_GATEWAY_URL;
  const token = env.MAIL_GATEWAY_TOKEN;

  if (!gatewayUrl || !token) {
    throw new Error(
      'Mail Gateway no configurado. Verifica MAIL_GATEWAY_URL y MAIL_GATEWAY_TOKEN en las variables de entorno.'
    );
  }

  const res = await fetch(`${gatewayUrl}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(options),
  });

  const responseText = await res.text().catch(() => '');

  if (!res.ok) {
    throw new Error(`Mail Gateway error ${res.status}: ${responseText || '(sin cuerpo)'}`);
  }

  let result: Partial<MailGatewayResponse>;

  try {
    result = JSON.parse(responseText) as Partial<MailGatewayResponse>;
  } catch {
    throw new Error('Mail Gateway devolvió una respuesta inválida.');
  }

  if (
    result.success !== true ||
    typeof result.messageId !== 'string' ||
    result.messageId.length === 0
  ) {
    throw new Error(`Mail Gateway no confirmó el envío: ${responseText}`);
  }

  return result as MailGatewayResponse;
}

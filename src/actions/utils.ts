import { ActionError } from 'astro:actions';
import { env } from 'cloudflare:workers';
import { z } from 'astro/zod';

export function getDB(): D1Database {
  const db = env.DB;
  if (!db) {
    throw new ActionError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database not available',
    });
  }
  return db;
}

// Configuración global del traductor de errores de Zod 4
z.config({
  // 1. Cargamos el idioma español nativo de Zod
  localeError: z.locales.es().localeError,
  
  // 2. Sobrescribimos algunos mensajes específicos para que suenen más amigables
  customError: (issue) => {
    // Para validación de correos
    if (issue.code === 'invalid_format' && 'format' in issue && issue.format === 'email') {
      return { message: 'Correo electrónico inválido' };
    }
    // Para longitud mínima de texto
    if (issue.code === 'too_small' && 'origin' in issue && issue.origin === 'string') {
      if (issue.minimum === 1) {
        return { message: 'Este campo es obligatorio' };
      }
      return { message: `Este campo debe tener al menos ${issue.minimum} caracteres` };
    }
    // Devolvemos undefined para que Zod use el idioma español por defecto en los demás casos
    return undefined;
  }
});

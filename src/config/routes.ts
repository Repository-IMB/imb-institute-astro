/**
 * Centralized Route Configuration
 * IMB Institute
 */

export const ROUTES = {
  HOME: '/',
  NOSOTROS: '/nosotros',
  CAPACITACION: '/capacitacion',
  CONTACTO: '/contacto',
  MATRICULA: '/ficha-de-matricula',
  PROGRAMA: '/programa-de-becarios',
  STAFF: '/staff-imb',
  RECLAMACIONES: '/reclamaciones',
  SOPORTE: '/soporte',
} as const;

/**
 * Helper to normalize strings into URL slugs
 */
export const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w-]+/g, '')       // Remove all non-word chars
    .replace(/--+/g, '-')           // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start
    .replace(/-+$/, '');            // Trim - from end
};

/**
 * Helper to generate course related paths
 */
export const COURSE_ROUTES = {
  LIST: ROUTES.CAPACITACION,
  DETAIL: (slug: string) => `${ROUTES.CAPACITACION}/${slug}`,
  CATEGORY: (category: string) => {
    const slug = slugify(category);
    return slug === 'todos' ? ROUTES.CAPACITACION : `${ROUTES.CAPACITACION}?category=${slug}`;
  }
};

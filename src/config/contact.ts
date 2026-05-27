/**
 * Centralized Contact Information Configuration
 * IMB Institute
 */

export const CONTACT_INFO = {
  emails: {
    info: 'info@imbinstitute.com',
    academic: 'academicdir@imbinstitute.com',
    support: 'soporte@imbinstitute.com',
    admission: 'academicdir@imbinstitute.com', // Map to academic direction for admission queries
  },
  phones: {
    support: '+51 941 328 673',
    supportRaw: '+51941328673', // Formatted for tel: links
  },
  socials: {
    whatsapp: 'https://wa.me/51941328673',
  }
} as const;

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
    academic: '+51 964 391 595',
    academicRaw: '+51964391595',
    admissions: '+51 969 930 671',
    admissionsRaw: '+51969930671',
    sales: '+51 932 329 714',
    salesRaw: '+51932329714',
    billing: '+51 984 142 963', // Seen in policies / terms
    billingRaw: '+51984142963',
  },
  socials: {
    whatsapp: 'https://wa.me/51941328673', // General / Support
    whatsappAcademic: 'https://wa.me/51964391595',
    whatsappAdmissions: 'https://wa.me/51969930671',
    whatsappSales: 'https://wa.me/51932329714',
  }
} as const;

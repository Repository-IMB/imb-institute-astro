import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site ?? new URL('https://new.imbinstitute.com');
  const isProductionDomain = siteUrl.hostname === 'imbinstitute.com';
  const lines = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin/',
  ];

  if (isProductionDomain) {
    lines.push(`Sitemap: ${new URL('/sitemap-index.xml', siteUrl).href}`);
  }

  return new Response(`${lines.join('\n')}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

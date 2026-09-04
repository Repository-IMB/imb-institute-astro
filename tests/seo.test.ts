import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import BaseLayout from '../src/layouts/BaseLayout.astro';
import AdminLayout from '../src/layouts/AdminLayout.astro';
import FormPage from '../src/components/forms/FormPage.astro';
import Breadcrumb from '../src/components/ui/Breadcrumb.astro';

const stagingSite = 'https://new.imbinstitute.com';

describe('SEO técnico', () => {
  it('genera canonical sin filtros y bloquea la indexación del dominio previo', async () => {
    const container = await AstroContainer.create({
      astroConfig: { site: stagingSite },
    });
    const html = await container.renderToString(BaseLayout, {
      partial: false,
      request: new Request(`${stagingSite}/capacitacion?category=logistica&q=datos`),
      props: {
        title: 'Programas de capacitación | IMB Institute',
        description: 'Consulta los programas disponibles.',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'IMB Institute',
        },
      },
      slots: { default: '<h1>Programas</h1>' },
    });
    const $ = load(html);

    expect($('meta[name="robots"]').attr('content')).toBe('noindex, nofollow');
    expect($('link[rel="canonical"]').attr('href')).toBe(`${stagingSite}/capacitacion`);
    expect($('meta[property="og:url"]').attr('content')).toBe(`${stagingSite}/capacitacion`);
    expect($('meta[property="og:image"]').attr('content')).toMatch(/^https:\/\/new\.imbinstitute\.com\//);
    expect($('meta[name="twitter:card"]').attr('content')).toBe('summary_large_image');
    expect($('script[type="application/ld+json"]').text()).toContain('"@type":"WebSite"');
  });

  it('mantiene las fichas operativas y administración fuera del índice', async () => {
    const container = await AstroContainer.create({
      astroConfig: { site: 'https://imbinstitute.com' },
    });
    const formHtml = await container.renderToString(FormPage, {
      partial: false,
      request: new Request('https://imbinstitute.com/ficha-de-datos'),
      props: {
        title: 'Ficha de datos',
        description: 'Actualiza tus datos.',
        eyebrow: 'Registro',
      },
      slots: { default: '<form></form>' },
    });
    const adminHtml = await container.renderToString(AdminLayout, {
      partial: false,
      request: new Request('https://imbinstitute.com/admin'),
      slots: { default: '<h1>Administración</h1>' },
    });

    expect(load(formHtml)('meta[name="robots"]').attr('content')).toBe('noindex, nofollow');
    expect(load(adminHtml)('meta[name="robots"]').attr('content')).toBe('noindex, nofollow');
  });

  it('renderiza migas de pan accesibles y marca la página actual', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Breadcrumb, {
      props: {
        items: [
          { label: 'Inicio', href: '/' },
          { label: 'Capacitación', href: '/capacitacion' },
          { label: 'Curso actual' },
        ],
      },
    });
    const $ = load(html);

    expect($('nav[aria-label="Migas de pan"]').length).toBe(1);
    expect($('a[href="/"]').length).toBe(1);
    expect($('[aria-current="page"]').text().trim()).toBe('Curso actual');
  });
});

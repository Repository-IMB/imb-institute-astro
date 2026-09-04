import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import Footer from '../src/components/ui/Footer.astro';

describe('footer público', () => {
  it('incluye las páginas públicas y excluye las fichas operativas', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(Footer);
    const $ = load(html);
    const hrefs = $('a')
      .map((_, link) => $(link).attr('href'))
      .get();

    expect(hrefs).toEqual(expect.arrayContaining([
      '/',
      '/nosotros',
      '/capacitacion',
      '/programa-de-becarios',
      '/staff-imb',
      '/contacto',
      '/soporte-academico',
      '/libro-de-reclamaciones',
      '/politica-de-privacidad',
      '/politica-cookies',
      '/terminos-condiciones-uso',
      '/politica-reembolsos-devoluciones',
      '/politicas-seguridad',
      '/aviso-legal',
    ]));

    expect(hrefs).not.toEqual(expect.arrayContaining([
      '/ficha-de-datos',
      '/ficha-de-registro-docentes',
      '/ficha-legacy-matricula',
      '/ficha-de-matricula',
      '/ficha-de-matricula-2',
      '/reclutamiento-docente',
    ]));

    const claimsLink = $('a[href="/libro-de-reclamaciones"]');
    expect(claimsLink.find('img[alt="Libro de Reclamaciones Digital"]').length).toBe(1);
  });
});

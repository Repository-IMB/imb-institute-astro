# IMB Institute

Sitio institucional de IMB Institute construido con Astro y desplegado en Cloudflare Workers.

## Stack

- Astro 7
- Tailwind CSS 4
- TypeScript
- Bun
- Cloudflare Workers y D1
- Astro Actions

## Desarrollo local

Requisitos: Bun y una versión de Node compatible con `package.json`.

```bash
bun install
bunx wrangler d1 execute imb-submissions --local --file=./db/schema.sql
bun run dev
```

Para configurar las variables de entorno locales, copia el archivo `.dev.vars.example` como `.dev.vars` y completa los valores:

```bash
cp .dev.vars.example .dev.vars
```

Nunca deben documentarse valores secretos ni subirse el archivo `.dev.vars` al repositorio.

### Correo en desarrollo

Define `MAIL_FORCE_TO` en `.dev.vars` para redirigir todas las notificaciones internas de formularios a un buzón de prueba. Esta variable tiene prioridad sobre los destinatarios de `src/config/form-recipients.ts` y sobre `MAIL_ADMISSIONS_TO`.

En producción, no definas `MAIL_FORCE_TO`: cada formulario utilizará sus destinatarios centralizados y `MAIL_ADMISSIONS_TO` quedará únicamente como respaldo. Los correos de confirmación destinados a la persona que completa un formulario no se redirigen.

### Flujo de formularios y correo

Las Astro Actions validan y guardan primero la respuesta en D1. Esa entrada es la fuente de verdad y nunca se elimina porque falle una notificación.

Después del registro, la Action solicita el envío al Mail Gateway, que valida el proyecto y llama directamente a Brevo. Si Brevo acepta el correo, el gateway devuelve su `messageId`. Si la notificación falla, el error queda registrado en los logs de Cloudflare, pero la persona sigue viendo la confirmación porque su formulario sí fue recibido y conservado.

Los adjuntos se envían directamente a Brevo mediante el gateway; no se almacenan en el Mail Gateway.

La postulación breve de `/staff-imb` es una excepción: conserva como fuente de verdad el sistema Olympus utilizado por la página anterior. Su Astro Action valida el formulario y reenvía los datos y el CV en PDF a `https://olympus.imbinstitute.com/api/api/FormularioStaff/Registrar`. Solo muestra la confirmación cuando Olympus acepta la solicitud; no duplica esa postulación en D1 ni en Brevo.

Cada formulario público tiene un componente propio en `src/components/forms/`. Los controles visuales y el comportamiento común de envío se reutilizan desde `src/components/ui/` y `src/scripts/submission-form.ts`, mientras que las Astro Actions mantienen la validación de servidor, los archivos, la persistencia en D1 y la solicitud al Mail Gateway.

Las fichas operativas añadidas desde los formularios anteriores conservan sus URL públicas: `/reclutamiento-docente`, `/ficha-de-registro-docentes`, `/ficha-legacy-matricula`, `/ficha-de-matricula-2` y `/ficha-de-datos`. El Libro de Reclamaciones usa `/libro-de-reclamaciones`; la ruta anterior `/reclamaciones` redirige a la nueva dirección. `/ficha-de-matricula` redirige a la URL histórica de la ficha en portugués.

## SEO y dominios

`site` en `astro.config.mjs` es la fuente de verdad para URLs canónicas, sitemap y robots. Mientras su valor sea `https://new.imbinstitute.com`, las páginas públicas incluyen `noindex, nofollow` para evitar que el entorno previo compita con el sitio oficial.

Cuando el proyecto reemplace al sitio actual, cambia `site` a `https://imbinstitute.com` y vuelve a desplegar. Las páginas públicas pasarán automáticamente a `index, follow`; las fichas operativas y `/admin` permanecerán fuera del índice. Antes del cambio, comprueba las redirecciones, el sitemap y las URLs canónicas generadas.

## Validación

```bash
bun run test
bun x astro check
bun run build
```

`bun run test` valida automáticamente las reglas de entrada y los destinos de todos los formularios públicos. Las pruebas no escriben en D1 ni envían mensajes reales al Mail Gateway, Brevo u Olympus.

## Despliegue

```bash
bunx wrangler deploy
```

La configuración de Cloudflare está en `wrangler.jsonc`. El schema de D1 está en `db/schema.sql`.

## Documentación

| Archivo | Contenido |
|---|---|
| `AGENTS.MD` | Reglas para agentes de IA |
| `STYLES_GUIDE.MD` | Sistema visual |
| `VOICE_GUIDE.MD` | Voz y redacción |

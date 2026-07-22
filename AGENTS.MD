# AGENTS.MD — Guía para Agentes IA: IMB Institute

> Este archivo es la fuente de verdad para agentes de IA que trabajen en este proyecto.
> - **Contenido y textos**: ver `CONTENT.MD`
> - **Estilos y tokens visuales**: ver `STYLES_GUIDE.MD`
> - **Contexto arquitectónico ampliado**: ver `CLAUDE.MD`

---

## Stack Tecnológico Actual

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Astro | v7 (latest) |
| Adaptador deploy | `@astrojs/cloudflare` | v14 |
| Estilos | Tailwind CSS v4 (CSS-first) | v4 |
| Base de datos | Cloudflare D1 (SQLite serverless) | — |
| Lógica servidor | Astro Actions (`src/actions/index.ts`) | — |
| Package manager | Bun | — |
| TypeScript | Strict mode (`astro/tsconfigs/strict`) | v6 |
| Validación | Zod v4 (incluido en `astro/zod`) | — |
| Deploy | Cloudflare Workers (via Wrangler) | — |
| Wrangler CLI | `^4.x` | — |

---

## Infraestructura Cloudflare

```
Browser → Cloudflare CDN → Cloudflare Worker (Astro SSR)
                                   │
                       ┌───────────┴────────────┐
                       │                        │
              Cloudflare D1               Cloudflare Access
              (binding: DB)               (protege /admin)
              SQLite serverless           sin código propio
```

- **Cloudflare Workers**: sirve el sitio Astro con SSR
- **Cloudflare D1**: BD SQLite serverless para formularios (binding `DB`)
- **Cloudflare Access**: protege `/admin` por email/Google (configurado en dashboard, no en código)

---

## Archivos de Configuración Clave

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindv4 from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',          // SSR obligatorio para Actions + D1
  adapter: cloudflare({
    imageService: 'passthrough',
    platformProxy: { enabled: true }  // bindings D1 disponibles en dev
  }),
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'placehold.co' }
    ],
  },
  vite: {
    plugins: [tailwindv4()],
  },
});
```

### `wrangler.toml`
```toml
name = "imb-institute-astro"
compatibility_date = "2025-01-01"
main = "@astrojs/cloudflare/entrypoints/server"

[assets]
directory = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "imb-submissions"
database_id = "59479035-d13f-4109-9497-defd4c0eddea"
```

### `tsconfig.json`
- Extiende `astro/tsconfigs/strict` (TypeScript estricto)
- Tipos de Cloudflare: `"types": ["@cloudflare/workers-types"]`
- Paths configurados: `@/*`, `@components/*`, `@layouts/*`, `@actions/*`, etc.

---

## Cómo Acceder a Cloudflare D1 (patrón correcto — Astro 7)

```typescript
// En Actions (src/actions/index.ts)
import { env } from 'cloudflare:workers';
const db = env.DB; // D1Database

// En páginas .astro con SSR
import { env } from 'cloudflare:workers';
export const prerender = false;
const db = env.DB;
```

> ⚠️ El patrón antiguo `Astro.locals.runtime.env` era de Astro 5. Con Astro 7 se usa `import { env } from 'cloudflare:workers'` directamente.

### Tipado del binding en `src/types/env.d.ts`
```typescript
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
  }
}
```

---

## Astro Actions — Reglas Importantes

- Todas las actions están en **`src/actions/index.ts`** bajo `export const server = { ... }`
- Usar `z.email()` (Zod v4), NO `z.string().email()` (deprecado)
- Para acceder a bindings dentro de un handler: `import { env } from 'cloudflare:workers'`
- `accept: 'form'` → para formularios HTML nativos
- `accept: 'json'` → para llamadas desde JS (como `exportCSV`)
- Los handlers que usan `context` activamente: `asesor` (URL params), `becarios` y `staff` (request.formData para archivos)

### FormTypes disponibles (todos en `src/types/submission.ts`)
`contacto` | `soporte` | `reclamaciones` | `alianzas` | `asesor` | `matricula` | `becarios` | `staff`

---

## Estructura de Páginas

| Ruta | Archivo | Notas |
|------|---------|-------|
| `/` | `src/pages/index.astro` | Home |
| `/nosotros` | `src/pages/nosotros.astro` | — |
| `/capacitacion` | `src/pages/capacitacion/index.astro` | Listado de cursos |
| `/capacitacion/[slug]` | `src/pages/capacitacion/[slug].astro` | Detalle de curso |
| `/contacto` | `src/pages/contacto.astro` | Formulario alianzas |
| `/ficha-de-matricula` | `src/pages/ficha-de-matricula.astro` | Formulario matrícula |
| `/reclamaciones` | `src/pages/reclamaciones.astro` | Libro de reclamaciones |
| `/soporte` | `src/pages/soporte.astro` | Soporte técnico |
| `/programa-de-becarios` | `src/pages/programa-de-becarios.astro` | — |
| `/staff-imb` | `src/pages/staff-imb.astro` | Postulación staff |
| `/admin` | `src/pages/admin/index.astro` | Dashboard (protegido por CF Access) |
| `/admin/submissions` | `src/pages/admin/submissions/index.astro` | Tabla + export CSV |
| `/admin/submissions/[id]` | `src/pages/admin/submissions/[id].astro` | Detalle de submission |

---

## Schema de Base de Datos D1

```sql
-- db/schema.sql
CREATE TABLE IF NOT EXISTS submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  form_type   TEXT NOT NULL,
  data        TEXT NOT NULL,  -- JSON con todos los campos del formulario
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_form_type ON submissions(form_type);
CREATE INDEX IF NOT EXISTS idx_created_at ON submissions(created_at);
```

Los campos del formulario se guardan como JSON en `data`. El CSV se genera dinámicamente desde ese JSON.

---

## Comandos del Proyecto

```bash
# Desarrollo local (corre sobre workerd — mismo runtime que producción)
bun run dev            # = astro dev

# Build (wrapper que ignora el known error de ASSETS binding en Pages)
bun run build          # = node scripts/build.js

# Deploy a Cloudflare Workers
bunx wrangler deploy

# Aplicar schema D1 local
bunx wrangler d1 execute imb-submissions --local --file=./db/schema.sql

# Aplicar schema D1 remoto (producción)
bunx wrangler d1 execute imb-submissions --remote --file=./db/schema.sql

# Regenerar tipos (después de cambios en actions o config)
bun x astro sync

# Verificar tipos TypeScript
bun x astro check
```

---

## Convenciones y Reglas del Proyecto

1. **TypeScript estricto** — `strict: true` vía `astro/tsconfigs/strict`
2. **Astro Actions** para toda lógica de formularios — NO usar `pages/api/`
3. **`export const prerender = false`** en todas las páginas de `/admin`
4. **Zod v4** — usar `z.email()` no `z.string().email()` (deprecado)
5. **Un componente por formulario** — no genéricos con props condicionales
6. **Tailwind v4** — config CSS-first, tokens en `src/styles/global.css` con `@theme`
7. **Imágenes estáticas** en `public/images/`, las de contenido dinámico vienen de APIs
8. **`Record<FormType, ...>`** es exhaustivo — siempre incluir los 8 form types al crear mapas

---

## Known Issues / Workarounds

### ASSETS binding conflict (Wrangler v4 + Cloudflare Pages)
El `[assets]` en `wrangler.toml` genera un error `'ASSETS' is reserved in Pages projects` durante el build. Está mitigado en `scripts/build.js` que ignora ese error específico. Los artifacts del build son válidos.

### `platformProxy` en desarrollo
Asegurarse de que `platformProxy: { enabled: true }` en `astro.config.mjs` para que el binding `DB` esté disponible al correr `bun run dev`.

### Regenerar tipos después de sync
Si el IDE muestra `Cannot find module 'astro:actions'`, correr `bun x astro sync` y reiniciar el TS Server en VS Code (`Ctrl+Shift+P` → "TypeScript: Restart TS Server").

---

## Referencias Documentación Oficial

- [Astro Actions](https://docs.astro.build/en/guides/actions/)
- [Adaptador Cloudflare](https://docs.astro.build/en/guides/integrations-guide/cloudflare/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Astro On-demand Rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

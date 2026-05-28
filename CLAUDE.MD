# Contexto del proyecto: IMB Institute — sitio web institucional

## Resumen ejecutivo

Rediseño completo del sitio web de IMB Institute, migrando desde un WordPress monolítico hacia un stack moderno. El sitio es principalmente estático/informativo con consumo de APIs externas para el contenido dinámico (cursos, noticias a futuro) y un sistema de formularios con panel administrativo simple.

> **Fuente de verdad de contenido y layout**: `CONTENT.MD`.
> **Fuente de verdad de estilo, tipografía y tokens visuales**: `STYLES_GUIDE.MD`.

---

## Stack tecnológico

| Capa | Tecnología | Motivo |
|---|---|---|
| Framework | Astro v5 (latest) | SEO excelente, HTML estático, mínimo JS |
| Estilos | Tailwind CSS v4 | Utility-first, sin configuración compleja |
| Adaptador | @astrojs/cloudflare | Despliegue en Cloudflare Pages |
| Base de datos | Cloudflare D1 (SQLite) | Gratuito, serverless, en el mismo ecosistema |
| Lógica servidor | Astro Actions | Manejo de formularios type-safe (forma moderna, no `pages/api/`) |
| Gestor de paquetes | Bun | Preferencia del equipo |
| Lenguaje | TypeScript | En todo el proyecto |
| Validación | Zod (incluido en Astro Actions) | Validación type-safe de formularios |

---

## Infraestructura Cloudflare

La empresa ya usa Cloudflare. Todo el proyecto vive dentro de su ecosistema:

- **Cloudflare Pages**: sirve el sitio Astro, CDN global, despliegue automático desde Git
- **Cloudflare D1**: base de datos SQLite serverless para las submissions de formularios
- **Cloudflare Access**: protege la ruta `/admin` con login por email/Google, sin código de autenticación propio
- Plan gratuito es suficiente para el volumen actual (~107 visitas/día, picos en matrícula ~1,000/día)

---

## Arquitectura de datos

### Contenido (solo lectura, desde APIs externas)
- **Cursos y facultades**: API externa REST (ya existe, no es responsabilidad de este proyecto)
- **Noticias**: estáticas en Fase 1 (archivos en `src/data/`), Fase 2 desde API externa
- El frontend hace `fetch()` a estas APIs en build time (SSG) o en runtime según corresponda

### Formularios (escritura, responsabilidad de este proyecto)
- El frontend llama a **Astro Actions** (`src/actions/index.ts`)
- Las Actions validan con Zod y escriben en **Cloudflare D1**
- Una sola tabla `submissions` con columna `form_type` para distinguir formularios
- El admin accede a `/admin` (protegido por Cloudflare Access) para ver y exportar CSV

> **Especificación de campos de cada formulario**: ver `CONTENT.MD` → "Formularios del proyecto".

---

## Estructura del proyecto

```
/
├── public/
│   ├── images/          ← logo, favicon, og-image, imágenes estáticas del sitio
│   └── robots.txt
│
├── src/
│   ├── actions/
│   │   └── index.ts     ← TODAS las Astro Actions (formularios)
│   │
│   ├── components/
│   │   ├── forms/       ← componentes de formulario (uno por form)
│   │   │   ├── FormContacto.astro
│   │   │   ├── FormMatricula.astro      ← multistep (4 pasos)
│   │   │   ├── FormReclamaciones.astro
│   │   │   ├── FormSoporte.astro
│   │   │   ├── FormAlianzas.astro
│   │   │   └── FormAsesor.astro         ← reutilizable en cada curso
│   │   └── ui/
│   │       ├── Navbar.astro
│   │       ├── Footer.astro
│   │       ├── CursoCard.astro
│   │       ├── NoticiaCard.astro
│   │       └── AdminTable.astro
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro             ← layout principal (SEO, nav, footer)
│   │   └── AdminLayout.astro            ← layout solo para /admin
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── nosotros.astro               ← contiene FormContacto ("Descubre IMB")
│   │   ├── noticias.astro               ← estático en Fase 1
│   │   ├── matricula.astro              ← contiene FormMatricula (4 pasos)
│   │   ├── reclamaciones.astro          ← contiene FormReclamaciones
│   │   ├── soporte.astro                ← contiene FormSoporte
│   │   ├── contacto.astro               ← contiene FormAlianzas
│   │   ├── 404.astro
│   │   ├── cursos/
│   │   │   ├── index.astro              ← listado de cursos desde API externa
│   │   │   └── [slug].astro             ← detalle de curso + FormAsesor
│   │   └── admin/
│   │       ├── index.astro              ← dashboard (resumen de submissions)
│   │       └── submissions.astro        ← tabla completa + botón Export CSV
│   │
│   ├── lib/
│   │   ├── db.ts                        ← funciones de acceso a D1
│   │   ├── api.ts                       ← funciones fetch a APIs externas
│   │   └── csv.ts                       ← genera el string CSV para descarga
│   │
│   ├── types/
│   │   ├── submission.ts                ← tipo TypeScript para una submission
│   │   ├── curso.ts                     ← tipo para curso (desde API externa)
│   │   └── noticia.ts                   ← tipo para noticia
│   │
│   └── styles/
│       └── global.css
│
├── db/
│   └── schema.sql                       ← definición de tabla D1
│
├── astro.config.mjs
├── wrangler.toml                        ← config Cloudflare (D1 binding, etc.)
├── tsconfig.json
└── package.json
```

---

## Schema de base de datos D1

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

Decisión de diseño: los campos del formulario se guardan como JSON en la columna `data`. Esto permite que cada formulario tenga sus propios campos sin necesidad de múltiples tablas o columnas opcionales. Para exportar CSV, se parsea el JSON y se generan las columnas dinámicamente.

---

## Panel administrativo `/admin`

- **Protección**: Cloudflare Access (configurado en el dashboard de Cloudflare, no en código)
- **`/admin/index.astro`**: resumen con conteo de submissions por tipo y por fecha
- **`/admin/submissions.astro`**: tabla con filtro por `form_type` y rango de fechas, botón "Exportar CSV" que llama a un endpoint o acción que genera el archivo
- El CSV exportado tiene como columnas: `id`, `form_type`, `created_at` + todas las claves del JSON `data` aplanadas

---

## Configuración de archivos clave

### `wrangler.toml`
```toml
name = "imb-website"
compatibility_date = "2025-01-01"
main = "@astrojs/cloudflare/entrypoints/server"

[assets]
directory = "./dist"

[[d1_databases]]
binding = "DB"
database_name = "imb-submissions"
database_id = "REEMPLAZAR_CON_ID_REAL"
```

### `astro.config.mjs`
```js
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindv4 from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',          // necesario para Actions y D1
  adapter: cloudflare(),
  vite: {
    plugins: [tailwindv4()],
  },
});
```

> **Nota**: `output: 'server'` es necesario porque las Astro Actions requieren server-side rendering. Las páginas puramente estáticas pueden usar `export const prerender = true` individualmente para recuperar el comportamiento SSG y maximizar el SEO.

---

## Comandos para inicializar el proyecto

```bash
# 1. Crear proyecto Astro mínimo con Bun
bun create astro@latest imb-website -- --template minimal

# 2. Entrar al proyecto
cd imb-website

# 3. Agregar adaptador Cloudflare
bunx astro add cloudflare

# 4. Agregar Tailwind
bunx astro add tailwind

# 5. Instalar Zod (para validación extra si se necesita fuera de Actions)
bun add zod

# 6. Crear la base de datos D1 (requiere Wrangler CLI)
bunx wrangler d1 create imb-submissions

# 7. Aplicar el schema
bunx wrangler d1 execute imb-submissions --local --file=./db/schema.sql
```

---


## Convenciones y reglas del proyecto

1. **TypeScript estricto** en todo el proyecto (`strict: true` en `tsconfig.json`)
2. **Astro Actions** para toda la lógica de formularios — NO crear archivos en `pages/api/`
3. **`export const prerender = true`** en páginas que no necesiten server (inicio, nosotros, cursos estáticos) para máximo rendimiento SEO
4. **Zod** para validación de todos los inputs — las Actions de Astro lo incluyen nativamente con `defineAction` y `z` de `astro:schema`
5. **Un componente por formulario** — no un componente genérico con props condicionales
6. **Tailwind v4** — la configuración es CSS-first, tokens en `global.css` con `@theme`. **Solo debe haber un `@import "tailwindcss";`** en el archivo global de CSS.
7. **Imágenes estáticas del sitio** en `public/images/`, imágenes de contenido dinámico vienen de las APIs externas
8. Las páginas de `/admin` deben tener `export const prerender = false` explícito
9. **Contenido textual** — replicar fielmente los textos, títulos y descripciones definidos en `CONTENT.MD`. No inventar ni modificar copy sin autorización.

> **Estilo, tipografía y tokens visuales**: toda la jerarquía tipográfica, tamaños, pesos, tracking, line-height, paleta de colores, clases Tailwind prohibidas/permitidas y reglas de UI están definidas exclusivamente en `STYLES_GUIDE.MD`. Ni `CLAUDE.MD` ni `CONTENT.MD` definen estilo.

---

## Fases de desarrollo

### Fase 1 (actual — lo que se construye ahora)
- Sitio completo de acuerdo al contenido en `CONTENT.MD`
- Consumo de API externa de cursos
- Noticias estáticas en `src/data/noticias/` como archivos JSON o TS
- Todos los formularios funcionando con D1
- Panel `/admin` con tabla y export CSV

### Fase 2 (futuro)
- Noticias desde API externa (solo cambiar `src/lib/api.ts` y la página, sin cambios de arquitectura)
- Cursos gestionados internamente si migran de la API externa

---

## Referencias documentación oficial

- Astro Actions: https://docs.astro.build/en/guides/actions/
- Adaptador Cloudflare: https://docs.astro.build/en/guides/integrations-guide/cloudflare/
- Estructura del proyecto: https://docs.astro.build/en/basics/project-structure/
- On-demand rendering: https://docs.astro.build/en/guides/on-demand-rendering/
- Cloudflare D1 con Astro: https://developers.cloudflare.com/d1/
- Tailwind CSS v4: https://tailwindcss.com/docs/v4-beta

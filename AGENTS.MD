# AGENTS.MD — IMB Institute

Instrucciones de trabajo para agentes de IA dentro de este repositorio.

## Fuentes del proyecto

| Archivo | Uso |
|---|---|
| `README.md` | Instalación, comandos y despliegue |
| `STYLES_GUIDE.MD` | Sistema visual y componentes |
| `VOICE_GUIDE.MD` | Voz, tono y reglas de redacción |
| `CONTENT.MD` | Referencia provisional de contenido; puede estar desactualizada |
| `CURSOS_API.md` | Contrato propuesto para una futura API de cursos |

El código y la configuración actuales prevalecen cuando un documento de referencia no coincide con la implementación. No asumir que los ejemplos de `CONTENT.MD` o `CURSOS_API.md` son datos reales.

## Skills del repositorio

- Cambios de interfaz: usar `ui-ux-pro-max` y `frontend-design`.
- Archivos `.astro`: usar `astro`.
- Tokens o sistema visual: usar `design-system`.
- Voz de marca: usar `brand`.
- Textos públicos: usar `humanize-writing` y respetar `VOICE_GUIDE.MD`.

Las skills aportan criterios y flujos de revisión. No sustituyen los requisitos del usuario, los datos confirmados ni las decisiones documentadas del proyecto. Cuando el usuario apruebe una decisión nueva, actualizar el MD correspondiente.

## Stack

- Astro 7 con TypeScript estricto.
- Tailwind CSS 4 con configuración CSS-first.
- Bun como package manager.
- Cloudflare Workers para SSR.
- Cloudflare D1 para formularios.
- Astro Actions para lógica de servidor.

## Reglas técnicas

1. Usar Astro Actions en `src/actions/index.ts`; no crear endpoints en `src/pages/api/`.
2. Acceder a D1 con `import { env } from 'cloudflare:workers'` y `env.DB`.
3. Usar `z.email()` con Zod 4.
4. Mantener `export const prerender = false` en las páginas de `/admin`.
5. Mantener un componente por formulario.
6. Centralizar etiquetas y estilos de `FormType` en `src/config/submissions.ts`; cualquier tipo nuevo debe incorporarse allí y en el enrutamiento de destinatarios.
7. Usar componentes de `src/components/ui/` cuando exista uno adecuado.
8. Usar los tokens de `src/styles/global.css`; evitar colores hexadecimales dentro de componentes.
9. Usar `MediaImage.astro` para imágenes y Lucide para iconos.
10. No modificar afirmaciones, estadísticas ni testimonios sin confirmación del usuario.
11. No colocar números de teléfono ni enlaces de WhatsApp "sueltos" (hardcoded) en los archivos `.astro`. Centralizar toda la información de contacto (teléfonos, correos, redes sociales) en `src/config/contact.ts` y usar la constante `CONTACT_INFO`.

## Validación

Después de un cambio, ejecutar lo que corresponda:

```bash
bun x astro check
bun run build
```

No corregir errores ajenos a la tarea sin autorización. Informar los errores preexistentes por separado.

## Comandos frecuentes

```bash
bun run dev
bun run build
bun x astro sync
bun x astro check
bunx wrangler deploy
bunx wrangler d1 execute imb-submissions --local --file=./db/schema.sql
bunx wrangler d1 execute imb-submissions --remote --file=./db/schema.sql
```

## Notas de Cloudflare

- El binding de D1 se llama `DB`.
- `platformProxy.enabled` debe permanecer activo en `astro.config.mjs` para desarrollo local.
- `scripts/build.js` gestiona el error conocido del binding reservado `ASSETS` durante el build.

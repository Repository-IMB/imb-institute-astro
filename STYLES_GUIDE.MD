# Sistema visual — IMB Institute

Este archivo define decisiones visuales. No contiene copy, contratos de API ni reglas de servidor.

## Dirección

IMB usa un estilo académico, profesional y minimalista. La interfaz debe sentirse clara y sobria, con suficiente espacio para leer sin parecer fría o corporativa en exceso.

- Usar rojo IMB como acento, no como fondo dominante.
- Priorizar composición, tipografía y espacio antes que efectos decorativos.
- Evitar gradientes llamativos, glassmorphism, sombras pesadas y exceso de cards.
- Mantener una sola dirección visual en todas las páginas públicas.

## Tokens

Los valores se definen en `src/styles/global.css` mediante `@theme`.

| Token | Valor | Uso |
|---|---:|---|
| `imb` | `#841822` | CTA principal, enlaces activos y acentos |
| `imb-hover` | `#A62632` | Hover del primario |
| `imb-dark` | `#5E1118` | Estado activo o presionado |
| `surface-0` | `#FFFFFF` | Superficie principal y cards |
| `surface-50` | `#F8F9FA` | Fondo secundario |
| `surface-100` | `#F3F4F6` | Estados suaves y placeholders |
| `text-primary` | `#000000` | Encabezados y texto principal |
| `text-secondary` | `#6B7280` | Descripciones y metadatos |
| `border-subtle` | `#E5E7EB` | Bordes visibles pero discretos |
| `icon-muted` | `#9CA3AF` | Iconos secundarios |

No repetir estos valores como hexadecimales en componentes. Usar las clases semánticas de Tailwind.

## Tipografía

- Encabezados y botones: Montserrat.
- Texto, labels y metadatos: Inter.
- El cuerpo de texto usa como mínimo `16px`; captions, labels y metadatos pueden usar `12px` o `14px` según su función.
- Los roles tipográficos se definen como tokens `--text-*` en `src/styles/global.css`.
- La etiqueta HTML expresa jerarquía semántica; el rol tipográfico controla la apariencia.
- Los títulos grandes usan tracking ajustado y líneas equilibradas; los títulos de componentes y cards usan `text-wrap: pretty`.
- No usar mayúsculas sostenidas en párrafos.

### Roles tipográficos

| Rol | Clase | Escala | Uso |
|---|---|---:|---|
| Display | `text-display` | `36–60px` fluido | Hero principal y cabeceras visuales de alto impacto |
| Título de página | `text-page-title` | `36–48px` fluido | Título principal de páginas interiores |
| Título de sección | `text-section-title` | `30–36px` fluido | Secciones principales de una página |
| Título de componente | `text-component-title` | `24px` | Formularios, paneles y llamadas internas |
| Título de card | `text-card-title` | `20px` | Cards de cursos, contenido y estados vacíos |
| Título de elemento | `text-item-title` | `18px` | Valores, opciones, acordeones y paneles compactos |
| Título de cuerpo | `text-body-title` | `16px` | Autores, valores cortos y grupos de navegación |
| Título compacto | `text-compact-title` | `14px` | Alertas y encabezados densos de administración |
| Lead | `text-lead` | `18–20px` fluido | Introducciones y descripciones principales |
| Cita | `text-quote` | `16–20px` fluido | Testimonios y citas destacadas |
| Estadística | `text-stat` | `36–48px` fluido | Cifras y métricas destacadas |
| Cuerpo | `text-body` | `16px` | Párrafos de contenido |
| Metadato | `text-meta` | `14px` | Fechas, cargos, ayudas y descripciones compactas |
| Label | `text-label` | `12px` | Eyebrows y etiquetas breves, normalmente en mayúsculas |
| Caption | `text-caption` | `12px` | Información auxiliar sin mayúsculas ni tracking especial |

### Reglas de uso

- Todo `h1`–`h6` debe recibir un rol tipográfico directamente o mediante un componente compartido como `HeroSection.astro` o `SectionHeader.astro`.
- No elegir el tamaño por la etiqueta: un `h3` puede usar `text-card-title`, `text-item-title` o `text-compact-title` según su función visual.
- No combinar un rol con utilidades paralelas de tamaño, peso, tracking o interlineado como `text-xl`, `font-bold`, `tracking-tight` o `leading-snug`.
- Se permiten utilidades de color, alineación, espaciado, truncado y estados interactivos junto al rol.
- Para cambiar la escala general, modificar el token correspondiente en `src/styles/global.css`, no cada página.
- Un tamaño fuera de esta escala debe responder a una necesidad específica de componente y quedar documentado antes de repetirse.

## Layout

- Todas las secciones usan `Wrapper.astro`.
- Ancho máximo: `max-w-360`.
- Usar layout mobile-first.
- Mantener espacios amplios entre bloques.
- Alternar `surface-0` y `surface-50` solo cuando ayude a separar secciones; no alternar de forma automática.
- Evitar scroll horizontal y anchos rígidos en contenido principal.

## Patrón aprobado para páginas públicas

La portada es la referencia inicial para el resto del sitio:

- Hero con fotografía de fondo, overlay oscuro y contenido centrado.
- Sin tags decorativos encima del título del hero.
- Una sola llamada principal y una secundaria cuando sean necesarias.
- Franja de organizaciones discreta.
- Secciones informativas con estructura editorial, no una cuadrícula de cards por defecto.
- Cursos y testimonios en cards simples, con bordes sutiles y sombras mínimas.
- Contacto visible al final de la página.

Cada página puede adaptar la composición a su contenido. No copiar la portada bloque por bloque.

## Componentes

### Wrapper

Usar `Wrapper.astro` para secciones, headers y footers. Evitar contenedores paralelos con anchos distintos.

### Botones

Usar `Button.astro`.

- `primary`: acciones principales.
- `outline`: acciones secundarias.
- `ghost`: acciones de baja prioridad.
- Altura táctil mínima: `44px`.
- El foco de teclado debe ser visible.

### Cards

Usar `Card.astro` para contenido elevado o interactivo.

- Radio moderado.
- Borde sutil.
- Sombra ligera o ninguna.
- Hover discreto y solo en elementos interactivos.

### Estados de curso

Usar `Badge.astro` con `success` para cursos activos y `warning` para cursos inactivos.

- Mostrar siempre el texto `Activo` o `Inactivo`; el color no comunica el estado por sí solo.
- Acompañar el texto con un punto de estado del mismo sistema cromático.
- Sobre fotografías, usar una superficie opaca, borde suave y sombra mínima para mantener el contraste con cualquier imagen.
- Mantener el badge en la esquina superior izquierda con una separación de `1rem`.
- No desaturar ni oscurecer la imagen completa para representar un curso inactivo.

### Catálogo de capacitación

La oferta se presenta en una sola página bajo `/capacitacion`:

- El buscador y los filtros actualizan el listado sin recargar ni abandonar la página.
- El bloque de búsqueda permanece `sticky` únicamente mientras el usuario recorre el catálogo; termina antes de la siguiente sección informativa.
- El buscador conserva un label semántico aunque se oculte visualmente en composiciones compactas. El recuento se anuncia mediante una región accesible sin ocupar espacio en móvil.
- Las acciones auxiliares pueden usar solo iconos cuando sean convenciones claras; deben conservar `aria-label`, tooltip, foco visible y un objetivo táctil de al menos `44px`.
- Las categorías conservan su nombre, usan `aria-pressed` y se muestran en una sola fila deslizable cuando no caben. El gesto horizontal debe tener controles de flecha equivalentes para ratón y teclado.
- Las categorías del catálogo se mantienen junto a los cursos en `src/data/cursos.ts`.
- El estado del filtro puede conservarse en parámetros de URL, pero no genera páginas de categoría independientes.
- Mostrar el número de resultados y un estado vacío cuando no haya coincidencias.
- Las preguntas frecuentes se colocan después del catálogo y reutilizan `Accordion.astro`.
- Los beneficios se presentan como una lista editorial, no como una colección de cards elevadas.
- Los descuentos, opciones de pago y servicios sujetos a convocatoria deben redactarse como condiciones por confirmar.
- Crear una página de categoría solo cuando tenga una intención de búsqueda distinta y contenido propio suficiente; no duplicar texto para aumentar el número de URLs.

### Imágenes

Usar `MediaImage.astro`.

- Reservar ancho y alto para evitar saltos de layout.
- Hero: carga prioritaria cuando sea la imagen principal.
- Imágenes fuera del primer viewport: `loading="lazy"`.
- Texto alternativo descriptivo; usar `alt=""` si la imagen es decorativa.

### Formularios

- Labels siempre visibles.
- Inputs con fondo transparente y borde inferior.
- Error junto al campo correspondiente.
- No depender solo del color para comunicar errores.
- Mantener estados de foco claros.
- En direcciones completas, agrupar dirección, ciudad, región o departamento y país. El país se elige desde un selector compartido para evitar variaciones de escritura.
- Los campos internos de gestión, como el estado inicial de una consulta, se envían ocultos y no ocupan espacio ni añaden decisiones innecesarias para la persona usuaria.
- Cuando una ficha extensa incluya canales de ayuda confirmados, el formulario puede ocupar la columna principal y el soporte una columna lateral `sticky` en escritorio. En móvil, el soporte se coloca después del formulario.
- El selector de documentos de `FormBecarios.astro` es la referencia visual y conserva su implementación propia por su flujo de varios archivos.
- Usar `FileUploadField.astro` en los demás formularios para mantener el mismo borde discontinuo, icono de carga, selección por clic o arrastre y listado con opción de eliminar.
- La zona de carga debe tener fondo blanco (`surface-0`) en reposo y `surface-50` durante la interacción. El icono usa fondo `surface-50` y color neutro, cambiando a IMB al interactuar.
- Toda la zona funciona como control de selección; no añadir botones visuales secundarios como “Buscar” dentro de ella.
- En las variantes verticales (`default` y `large`), el icono y los textos permanecen centrados; la variante `compact` los distribuye horizontalmente y centrados en altura.
- Elegir la altura según el contexto: `large` cuando se necesite una zona amplia, `default` para adjuntos dentro de formularios extensos y `compact` para un único archivo en formularios breves como Staff.
- Configurar en el componente los formatos, cantidad y límites de peso; la validación del servidor debe conservar los mismos límites.

## Movimiento

- Transiciones entre `200ms` y `300ms`.
- Animar opacidad y transform cuando sea posible.
- Evitar animaciones continuas salvo que aporten contexto.
- Respetar `prefers-reduced-motion`.
- La navegación entre páginas usa un crossfade breve con un desplazamiento vertical mínimo.
- Las secciones aparecen una sola vez al entrar en el viewport; no animar cada elemento interno por defecto.
- El movimiento debe sentirse sobrio y funcional: ayuda a seguir la lectura, no compite con el contenido.

## Checklist

- Contraste AA como mínimo.
- Navegación completa con teclado.
- Foco visible.
- Objetivos táctiles de al menos `44px`.
- Sin scroll horizontal en móvil.
- Sin colores raw en componentes.
- Encabezados y textos recurrentes usan roles tipográficos; no escalas locales duplicadas.
- Sin emojis como iconos de interfaz.
- Sin sombras o animaciones que compitan con el contenido.

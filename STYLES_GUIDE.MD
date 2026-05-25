# IMB Institute — Design System: Premium Editorial

**Version:** 6.0  
**Aesthetic Direction:** Premium Academic / Minimalist Editorial  
**Core Principles:** Visual hierarchy through typography, borderless surfaces, generous whitespace, and refined elegance.

---

## 1. Component Construction Strategy

**Primary Mandate:** Prioritize the use of existing components located in `@src/components/ui/**`. These components are pre-configured with the system's aesthetic and functional logic. Manual HTML tags for UI elements (buttons, images, sections, containers) are strictly prohibited when a corresponding UI component exists.

---

## 2. Color Architecture

The palette is built on extreme clarity. We use pure black as our anchor and brand red for functional emphasis.

### Brand Core
- **Primary:** `#841822` (IMB Red). Used *only* for high-priority CTAs and active states.
- **Accents:**
  - `primary-light`: `#A62632` (Interactive hover)
  - `primary-dark`: `#5E1118` (Pressed/Active)

### Neutral Scale
Clean, pure-neutral palette to let editorial content breathe.
- **Surface 0:** `#FFFFFF` (Pure white — elevated cards and main containers) / `#000000` (Pure Black in Dark Mode)
- **Surface 50:** `#F8F9FA` (Main app background) / `#050505` (Deepest Black in Dark Mode)
- **Surface 100:** `#F3F4F6` (Subtle hover states, disabled elements) / `#111111` (Elevated surface in Dark Mode)
- **Text-Primary:** `#000000` (Pure Black — headings, body, input values)
- **Text-Secondary:** `#6B7280` (Softer Gray — descriptions, metadata, labels, placeholders)

---

## 3. Typography: The Editorial Stack

We utilize **Montserrat** for display and **Inter** for body text. This pairing creates a strong editorial hierarchy — expressive headings contrasted with clean, readable prose.

### Display Font: Montserrat
- **Usage:** Hero titles, section headings (H1–H4), buttons, large statistical numbers.
- **Weights:** ExtraBold (800) for hero titles, Bold (700) for standard headings, SemiBold (600) for buttons.
- **Tracking:** Tight (`tracking-tight` or `tracking-tighter`) on large sizes to maintain optical density.

### Body Font: Inter
- **Usage:** Body paragraphs, form labels, metadata, navigation links, descriptions.
- **Weights:** Regular (400) for body, Medium (500) for labels and nav, Bold (700) for small uppercase meta-tags.
- **Line Height:** Generous (`leading-relaxed` / 1.75) for academic readability.

### Scale Reference (Desktop)
| Level | Font | Size | Weight | Tracking |
|---|---|---|---|---|
| H1 / Hero | Montserrat | ≥ 56px | 800 | -0.03em |
| H2 / Section | Montserrat | 36–48px | 700 | -0.02em |
| H3 / Card Title | Montserrat | 24–28px | 700 | tight |
| H4 / Sub-heading | Montserrat | 18–20px | 600 | normal |
| Body | Inter | 16px | 400 | normal |
| Label / Meta | Inter | 12–13px | 500–700 | wide |

---

## 4. Grid & Layout (Editorial Rhythm)

Layout is driven by vertical rhythm and generous proportions. Separation is achieved through surface color shifts and whitespace.

- **Mandatory Wrapper:** ALL page sections must use the `@src/components/ui/Wrapper.astro` component.
  - Standard sections use `padded` (default `py-24` to `py-48`).
  - Hero sections use `full` prop for edge-to-edge backgrounds with constrained internal content.
- **Max Width:** Content is constrained to `max-w-360` (1440px) via the Wrapper component.
- **Section Padding:** Controlled by the Wrapper component to maintain "Swiss Tech" high-whitespace priority.

---

## 5. Component Technical Mandates

### Media & Images
- **Mandatory Component:** Use `@src/components/ui/MediaImage.astro` for ALL images. 
- **Features:** Automated fallback (placeholder), performance optimization (Astro Image), and consistent object-fit handling.

### Buttons (Refined CTAs)
- **Mandatory Component:** Use `@src/components/ui/Button.astro` for ALL buttons and button-like anchors.
- **Variants:**
  - **Primary:** Solid `bg-imb` (#841822), white text.
  - **Outline:** `bg-surface-50` with primary text and subtle border.
  - **Ghost:** Minimalist interactive state with primary color hover.

### Cards & Containers
- **Rule:** Use `@src/components/ui/Card.astro`.
- **Borders:** Subtle `border-border-subtle` added to cards for visibility in Dark Mode.
- **Shadows (Theme Aware):**
  - **Light Mode:** Subtle soft shadows (`shadow-sm`).
  - **Dark Mode:** Deep shadows with a 1px white/grey glow to provide depth on dark surfaces.

### Dark Mode Logic
- **Pure Black Foundation:** The system uses `#000000` as the base for surfaces in dark mode.
- **Fixed Contrast:** Critical sections (Hero, Page Headers) use fixed dark backgrounds (`bg-gray-950` or similar) to ensure white text remains readable regardless of the user's active theme.
- **Theme Switching:** Managed via the `.dark` class on the `<html>` element.

---

## 6. Component Technical Specs

### Inputs & Forms (Bottom Border Style)
Forms must feel lightweight and intentional.

- **Background:** Transparent (`bg-transparent`).
- **Borders:** No full borders. Only a `border-b-2 border-gray-200` bottom border.
- **Focus State:** Bottom border transitions to primary color (`focus:border-imb`). No focus rings or glow.
- **Labels:** Small, uppercase or standard casing, secondary text color. Placed above the input.
- **Input Text:** Montserrat `text-base` or `text-lg` for contrast and readability.
- **Layout:** One field per line, `space-y-8` vertical spacing.

---

## 7. Interaction Design

- **Hover States:** Smooth and intentional. Background surface shifts or shadow elevation changes. No abrupt color swaps.
- **Transitions:** `duration-200`, `ease-out`. Professional and refined.
- **Cursor:** `pointer` strictly for actionable elements.
- **Motion Philosophy:** Subtle and purposeful. One well-orchestrated entrance animation on load is preferred over scattered micro-interactions.

---

## 8. Implementation Checklist

- [ ] Prioritize components from `@src/components/ui/**`.
- [ ] Use `Button.astro` for all buttons and call-to-actions.
- [ ] Use `Wrapper.astro` for all section-level containers.
- [ ] Use `MediaImage.astro` for all image assets.
- [ ] Use `Card.astro` for all elevated content blocks.
- [ ] Minimum AA accessibility contrast on all text (target AAA for body copy).
- [ ] No hard borders between sections — surface shifts and Wrapper padding only.
- [ ] Display font (Montserrat) for all headings, buttons, and stat numbers.
- [ ] Hero sections use dark overlay gradient with red text gradient on key H1 word.
- [ ] Custom scrollbar applied globally.

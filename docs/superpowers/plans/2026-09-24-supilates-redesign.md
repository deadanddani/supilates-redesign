# Rediseño Su Pilates by Flor — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir una réplica estática y rediseñada de supilatesbyflor.com en Astro 5, con paridad funcional completa, que sirva como propuesta comercial para vender un rediseño.

**Architecture:** Astro 5 con salida estática y sin framework de UI. El contenido (servicios, testimonios, FAQ, blog) vive en colecciones Markdown validadas con Zod, de modo que un contenido malformado rompe la compilación en vez de publicar una página rota. Los datos de contacto viven en un único módulo `site.ts` del que salen la cabecera, el pie, los enlaces `tel:`/`mailto:` y el JSON-LD. Los componentes de `sections/` reciben sus datos por props; las páginas son quienes consultan las colecciones.

**Tech Stack:** Astro 5, TypeScript en modo estricto, CSS propio con custom properties, `astro:assets` para imágenes, `@fontsource-variable` para fuentes autoalojadas, Playwright + `@axe-core/playwright` para verificación, GitHub Actions + GitHub Pages para despliegue.

**Spec:** `docs/superpowers/specs/2026-09-23-supilates-redesign-design.md`

## Global Constraints

- **Astro 5**, salida `static`. TypeScript con `strict: true`.
- **Sin framework de UI.** Nada de React, Vue, Svelte ni Solid.
- **Sin Tailwind ni framework CSS.** CSS propio, tokens en `src/styles/tokens.css`, estilos con ámbito por componente `.astro`.
- **Fuentes autoalojadas** vía `@fontsource-variable/fraunces` y `@fontsource-variable/figtree`. Ninguna petición a `fonts.googleapis.com` ni `fonts.gstatic.com` en el HTML servido.
- **Todas las páginas llevan `<meta name="robots" content="noindex, nofollow">`** y `public/robots.txt` contiene `Disallow: /`. La demo replica textos de un negocio real; indexarla le crearía contenido duplicado.
- **Sin `aggregateRating` en el JSON-LD.** Su web no publica nota numérica. La interfaz dice "Excelente · 89 reseñas en Google", nunca una cifra.
- **`<meta name="viewport" content="width=device-width, initial-scale=1">`** — sin `maximum-scale` ni `user-scalable`.
- **Textos literales de su web.** Sólo se corrigen el typo "Alcaá"→"Alcalá" y el placeholder "Mensaje de éxito".
- **Testimonios: sólo los positivos.**
- **WCAG 2.1 AA.** Contraste ≥ 4.5:1 en texto normal, áreas pulsables ≥ 44×44 px, foco visible.
- **`prefers-reduced-motion: reduce` desactiva los ocho efectos de scroll** y deja la página completamente usable.
- **Presupuesto:** Lighthouse ≥ 95 en las cuatro categorías (móvil), JS total ≤ 15 KB comprimido, HTML de la home ≤ 25 KB comprimido, CLS < 0,05.
- **Idioma `es`.** Ningún rótulo en inglés en la interfaz.
- Rama de trabajo `feat/initial-build`. Commit al final de cada tarea.

## Review Focus

Condiciones que el spec implica y que ninguna tarea ejercitaría por defecto. Cada línea tiene su test asignado a la tarea que posee el código.

1. **Contenido Markdown con un campo obligatorio ausente o mal tipado** — la compilación debe fallar con un mensaje que nombre el archivo, nunca publicar la página incompleta. *Test en Tarea 4.*
2. **`prefers-reduced-motion: reduce`** — los ocho efectos quedan inertes, ningún elemento se queda con `opacity: 0` ni fuera de pantalla, y todo el contenido es legible. *Test en Tarea 8.*
3. **JavaScript no disponible** — el acordeón de FAQ, la navegación móvil y todo el contenido siguen accesibles. Por eso el acordeón usa `<details>` nativo y el contenido no depende de JS para ser visible. *Test en Tareas 6 y 9.*
4. **Viewport de 320 px** — ninguna página produce scroll horizontal. Es el ancho real de un iPhone SE, que parte de su público usa. *Test en Tarea 7.*
5. **Colección de blog vacía** — `/blog` debe renderizar un estado vacío legible, no romper la compilación ni mostrar una lista rota. *Test en Tarea 10.*

---

## Estructura de archivos

| Archivo | Responsabilidad |
| --- | --- |
| `src/data/site.ts` | Única fuente de verdad: NAP, horarios, redes, WhatsApp |
| `src/content.config.ts` | Esquemas Zod de las cuatro colecciones |
| `src/styles/tokens.css` | Custom properties: color, tipografía, espacio, radios |
| `src/styles/global.css` | Reset, estilos base, utilidades `.wrap` y `.rv` |
| `src/layouts/BaseLayout.astro` | `<head>` completo, JSON-LD, cabecera, pie, FAB |
| `src/layouts/PostLayout.astro` | Entrada de blog |
| `src/components/ui/*.astro` | Primitivas sin conocimiento del dominio |
| `src/components/layout/*.astro` | Header, Nav, Footer, WhatsAppFab, SkipLink |
| `src/components/sections/*.astro` | Secciones de página, datos por props |
| `src/scripts/scroll.ts` | Los ocho efectos, con guardia de reduced-motion |
| `src/pages/*.astro` | Consultan colecciones e inyectan props |
| `tests/*.spec.ts` | Playwright: rutas, accesibilidad, responsive |

---

## Task 1: Andamiaje Astro y arnés de verificación

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`
- Create: `src/pages/index.astro`, `tests/routes.spec.ts`
- Create: `.gitignore` (ya existe — verificar que cubre `node_modules/`, `dist/`, `.astro/`)

**Interfaces:**
- Consumes: nada
- Produces: `npm run build` genera `dist/`; `npm run test` ejecuta Playwright contra `dist/` servido en el puerto 4321

- [ ] **Step 1: Crear el proyecto Astro**

```bash
cd /Users/mireiamauropiquer/orca/supilates-redesign
git checkout -b feat/initial-build
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict --skip-houston
npm install
npm install -D @playwright/test @axe-core/playwright
npx playwright install chromium
```

- [ ] **Step 2: Configurar Astro para salida estática**

`astro.config.mjs`:

```js
// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://deadanddani.github.io',
  base: '/supilates-redesign',
  output: 'static',
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
});
```

- [ ] **Step 3: Escribir el test de rutas que falla**

`tests/routes.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('la home responde y tiene un h1', async ({ page }) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
});
```

`playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: { baseURL: 'http://localhost:4321/supilates-redesign' },
  webServer: {
    command: 'npm run build && npx astro preview --port 4321',
    url: 'http://localhost:4321/supilates-redesign',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
```

- [ ] **Step 4: Ejecutar el test y verificar que falla**

Run: `npx playwright test tests/routes.spec.ts`
Expected: FAIL — la home mínima de la plantilla no tiene `<h1>`

- [ ] **Step 5: Implementación mínima**

`src/pages/index.astro`:

```astro
---
---
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Su Pilates by Flor</title>
  </head>
  <body>
    <h1>Su Pilates by Flor</h1>
  </body>
</html>
```

- [ ] **Step 6: Ejecutar el test y verificar que pasa**

Run: `npx playwright test tests/routes.spec.ts`
Expected: PASS

- [ ] **Step 7: Añadir el script de test a package.json**

```json
"scripts": { "dev": "astro dev", "build": "astro build", "preview": "astro preview", "check": "astro check", "test": "playwright test" }
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: andamiaje Astro con arnés de verificación Playwright"
```

---

## Task 2: Sistema de diseño

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`
- Create: `docs/DESIGN-SYSTEM.md`
- Test: `tests/contrast.spec.ts`

**Interfaces:**
- Produces: custom properties `--bone --surf --ink --body --mor --mor-d --verde --lila --line`, utilidades `.wrap` `.btn` `.kick` `.rv`, escala tipográfica con `clamp()`

- [ ] **Step 1: Escribir el test de contraste que falla**

`tests/contrast.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

function luminance(hex: string): number {
  const v = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
function ratio(a: string, b: string): number {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}

test('cada pareja texto/fondo cumple AA', async ({ page }) => {
  await page.goto('/');
  const t = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    const g = (n: string) => s.getPropertyValue(n).trim();
    return { bone: g('--bone'), surf: g('--surf'), ink: g('--ink'), body: g('--body'), mor: g('--mor'), verde: g('--verde') };
  });
  expect(ratio(t.body, t.bone)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(t.ink, t.bone)).toBeGreaterThanOrEqual(4.5);
  expect(ratio(t.body, t.surf)).toBeGreaterThanOrEqual(4.5);
  expect(ratio('#ffffff', t.mor)).toBeGreaterThanOrEqual(4.5);
  expect(ratio('#ffffff', t.verde)).toBeGreaterThanOrEqual(4.5);
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx playwright test tests/contrast.spec.ts`
Expected: FAIL — las custom properties no existen todavía

- [ ] **Step 3: Escribir los tokens**

`src/styles/tokens.css`:

```css
:root {
  --bone: #f7f3ee;
  --surf: #ffffff;
  --ink: #3f1c4a;
  --body: #5c4a62;
  --mor: #7d1f8f;
  --mor-d: #3f1c4a;
  --verde: #2e7d32;
  --lila: #f0e8f2;
  --line: #e7dcea;
  --star: #b8860b;

  --font-display: 'Fraunces Variable', Georgia, 'Times New Roman', serif;
  --font-body: 'Figtree Variable', system-ui, -apple-system, 'Segoe UI', sans-serif;

  --step--1: clamp(0.83rem, 0.8rem + 0.15vw, 0.9rem);
  --step-0: clamp(1rem, 0.96rem + 0.2vw, 1.09rem);
  --step-1: clamp(1.2rem, 1.1rem + 0.5vw, 1.45rem);
  --step-2: clamp(1.44rem, 1.25rem + 0.95vw, 1.94rem);
  --step-3: clamp(1.73rem, 1.4rem + 1.65vw, 2.59rem);
  --step-4: clamp(2.07rem, 1.53rem + 2.7vw, 3.45rem);
  --step-5: clamp(2.49rem, 1.6rem + 4.45vw, 4.6rem);

  --space-xs: 0.5rem;
  --space-s: 1rem;
  --space-m: 1.75rem;
  --space-l: clamp(2.5rem, 5vw, 4rem);
  --space-xl: clamp(4.5rem, 11vw, 8rem);

  --radius-s: 0.5rem;
  --radius-m: 1.125rem;
  --radius-l: 1.375rem;
  --radius-pill: 99rem;

  --wrap: 71.25rem;
  --gutter: clamp(1.25rem, 5vw, 2.5rem);
}
```

Nota sobre `--star: #b8860b`: el dorado `#e3a21a` del mockup no llega a 4.5:1 sobre blanco. Las estrellas llevan además un `aria-label` textual, así que el color no es el único portador de la información.

- [ ] **Step 4: Escribir los estilos globales**

`src/styles/global.css` — reset, tipografía base, y las utilidades `.wrap`, `.btn`, `.btn-g`, `.btn-o`, `.kick`, `.rv`, `.visually-hidden`, más el bloque `@media (prefers-reduced-motion: reduce)` que neutraliza `.rv`:

```css
@import '@fontsource-variable/fraunces';
@import '@fontsource-variable/figtree';
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; }
html { scroll-behavior: smooth; scroll-padding-top: 5.5rem; -webkit-text-size-adjust: 100%; }
body { background: var(--bone); color: var(--body); font-family: var(--font-body); font-size: var(--step-0); line-height: 1.65; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: var(--font-display); color: var(--ink); font-weight: 400; letter-spacing: -0.025em; line-height: 1.08; text-wrap: balance; }
p { text-wrap: pretty; }
img, video { display: block; max-width: 100%; height: auto; }
a { color: inherit; }
:focus-visible { outline: 3px solid var(--mor); outline-offset: 3px; border-radius: 2px; }

.wrap { max-width: var(--wrap); margin-inline: auto; padding-inline: var(--gutter); }
.kick { font-size: var(--step--1); font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #7a5a80; }
.visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }

.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 44px; background: var(--mor); color: #fff; padding: 0.75rem 1.5rem; border-radius: var(--radius-pill); font-size: var(--step-0); font-weight: 700; text-decoration: none; transition: transform 0.2s, box-shadow 0.2s; }
.btn:hover { transform: translateY(-2px); box-shadow: 0 0.6rem 1.5rem rgb(125 31 143 / 0.28); }
.btn-g { background: var(--verde); }
.btn-o { background: none; border: 1.5px solid #c9b6ce; color: var(--ink); font-weight: 600; }

.rv { opacity: 0; transform: translateY(2.375rem); transition: opacity 0.75s cubic-bezier(0.22, 0.61, 0.36, 1), transform 0.75s cubic-bezier(0.22, 0.61, 0.36, 1); }
.rv.in { opacity: 1; transform: none; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  html { scroll-behavior: auto; }
  .rv { opacity: 1; transform: none; }
}
```

- [ ] **Step 5: Instalar las fuentes e importar los estilos en la página**

```bash
npm install @fontsource-variable/fraunces @fontsource-variable/figtree
```

Añadir `import '../styles/global.css';` al frontmatter de `src/pages/index.astro`.

- [ ] **Step 6: Ejecutar el test y verificar que pasa**

Run: `npx playwright test tests/contrast.spec.ts`
Expected: PASS — las cinco parejas superan 4.5:1

- [ ] **Step 7: Escribir `docs/DESIGN-SYSTEM.md`**

Tabla de tokens con su valor y su uso, la escala tipográfica, las reglas de movimiento, y la nota sobre por qué `--verde` bajó de `#32d232` a `#2e7d32` y `--star` de `#e3a21a` a `#b8860b`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: sistema de diseño con tokens verificados a contraste AA"
```

---

## Task 3: Datos del sitio y layout base

**Files:**
- Create: `src/data/site.ts`, `src/layouts/BaseLayout.astro`
- Test: `tests/head.spec.ts`

**Interfaces:**
- Produces: `site` (objeto con `name`, `phone`, `phoneHref`, `email`, `address`, `hours`, `whatsapp`, `social`, `reviews`), y `BaseLayout` con props `{ title: string; description: string; ogImage?: string }`

- [ ] **Step 1: Escribir el test del `<head>` que falla**

`tests/head.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('el head cumple las restricciones del spec', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport).not.toMatch(/maximum-scale|user-scalable/);
  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
  const title = await page.title();
  expect(title).toContain('Alcalá');
  expect(title).not.toContain('Alcaá');
});

test('el JSON-LD describe el negocio sin inventar valoración', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').innerText();
  const ld = JSON.parse(raw);
  expect(ld['@type']).toBe('HealthAndBeautyBusiness');
  expect(ld.telephone).toBe('+34611789488');
  expect(ld.address.addressLocality).toBe('Alcalá de Henares');
  expect(ld.openingHoursSpecification).toHaveLength(2);
  expect(ld.aggregateRating).toBeUndefined();
});

test('no se piden fuentes a Google', async ({ page }) => {
  const externos: string[] = [];
  page.on('request', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) externos.push(r.url());
  });
  await page.goto('/');
  expect(externos).toEqual([]);
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx playwright test tests/head.spec.ts`
Expected: FAIL — no hay `meta[name="robots"]` ni JSON-LD

- [ ] **Step 3: Escribir `src/data/site.ts`**

```ts
export const site = {
  name: 'Su Pilates by Flor',
  tagline: 'Fortalece tu Cuerpo, Mente y Espíritu',
  city: 'Alcalá de Henares',
  phone: '611 78 94 88',
  phoneHref: 'tel:+34611789488',
  phoneE164: '+34611789488',
  email: 'info@supilatesbyflor.com',
  address: { street: 'Avenida Caballería Española 14', postalCode: '28805', locality: 'Alcalá de Henares', region: 'Madrid', country: 'ES' },
  hours: [
    { days: 'Lun – Vie', time: '8:00 – 21:00', schema: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '21:00' } },
    { days: 'Sáb', time: '10:00 – 13:00', schema: { days: ['Saturday'], opens: '10:00', closes: '13:00' } },
  ],
  whatsapp: 'https://wa.link/4oru75',
  social: { instagram: 'https://www.instagram.com/supilatesbyflor/' },
  reviews: { count: 89, label: 'Excelente', source: 'Google' },
} as const;
```

`social` incluye sólo Instagram: los enlaces de Facebook y YouTube de su web no tienen destino (hallazgo 4 de la auditoría). `reviews` no lleva nota numérica, por la restricción global.

- [ ] **Step 4: Escribir `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { site } from '../data/site';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import WhatsAppFab from '../components/layout/WhatsAppFab.astro';
import SkipLink from '../components/layout/SkipLink.astro';

interface Props { title: string; description: string; ogImage?: string; }
const { title, description, ogImage = '/og.jpg' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: site.name,
  telephone: site.phoneE164,
  email: site.email,
  url: canonical,
  address: {
    '@type': 'PostalAddress',
    streetAddress: site.address.street,
    postalCode: site.address.postalCode,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  openingHoursSpecification: site.hours.map((h) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: h.schema.days,
    opens: h.schema.opens,
    closes: h.schema.closes,
  })),
};
---
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={new URL(ogImage, Astro.site).href} />
    <meta property="og:locale" content="es_ES" />
    <meta name="twitter:card" content="summary_large_image" />
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <SkipLink />
    <Header />
    <main id="contenido"><slot /></main>
    <Footer />
    <WhatsAppFab />
  </body>
</html>
```

- [ ] **Step 5: Actualizar `src/pages/index.astro` para usar el layout**

Título: `Su Pilates by Flor | Pilates con máquina en Alcalá de Henares` — corrige el hallazgo 1 de la auditoría.

- [ ] **Step 6: Ejecutar los tests y verificar que pasan**

Run: `npx playwright test tests/head.spec.ts`
Expected: PASS — los tres tests

- [ ] **Step 7: Crear `public/robots.txt`**

```
User-agent: *
Disallow: /
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: layout base con noindex, Open Graph y JSON-LD sin valoración inventada"
```

---

## Task 4: Colecciones de contenido con validación Zod

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/servicios/*.md` (7), `src/content/testimonios/*.md` (3), `src/content/faq/*.md` (6), `src/content/blog/*.md` (3)
- Test: `tests/content-schema.spec.ts`

**Interfaces:**
- Produces: colecciones `servicios` (`{ titulo, resumen, icono, orden, destacado }`), `testimonios` (`{ autor, fuente, orden }`), `faq` (`{ pregunta, orden }`), `blog` (`{ titulo, descripcion, fecha, borrador }`)

- [ ] **Step 1: Escribir el test que verifica que el contenido malformado rompe la compilación**

`tests/content-schema.spec.ts` — este test no usa el navegador; ejecuta la compilación como subproceso:

```ts
import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { writeFileSync, rmSync } from 'node:fs';

test('un servicio sin icono rompe la compilación', () => {
  const ruta = 'src/content/servicios/__roto.md';
  writeFileSync(ruta, '---\ntitulo: Roto\nresumen: Sin icono\norden: 99\n---\n');
  try {
    expect(() => execFileSync('npx', ['astro', 'build'], { stdio: 'pipe' })).toThrow();
  } finally {
    rmSync(ruta, { force: true });
  }
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx playwright test tests/content-schema.spec.ts`
Expected: FAIL — sin esquema, la compilación acepta cualquier frontmatter

- [ ] **Step 3: Escribir `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: z.object({
    titulo: z.string().min(1),
    resumen: z.string().min(1),
    icono: z.enum(['maquina', 'corazon', 'grupo', 'personal', 'mayores', 'embarazo', 'terapeutico']),
    orden: z.number().int().positive(),
    destacado: z.boolean().default(false),
  }),
});

const testimonios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonios' }),
  schema: z.object({ autor: z.string().min(1), fuente: z.string().default('Reseña en Google'), orden: z.number().int().positive() }),
});

const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({ pregunta: z.string().min(1), orden: z.number().int().positive() }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    titulo: z.string().min(1),
    descripcion: z.string().min(1),
    fecha: z.coerce.date(),
    borrador: z.boolean().default(false),
  }),
});

export const collections = { servicios, testimonios, faq, blog };
```

- [ ] **Step 4: Escribir los 7 servicios**

Uno por archivo, con los títulos y textos de su web: Pilates con máquina (destacado), Atención personalizada, Grupos reducidos, Entrenamiento personalizado, Tercera edad, Embarazo y posparto, Deportivo / Terapéutico.

- [ ] **Step 5: Escribir los 3 testimonios positivos**

Textos literales de su web: el de la home ("Encantada con las clases…", autor "Alumna del estudio"), Antonia Álvarez, Israel Vilches. Las dos reseñas de 1 estrella no se replican.

- [ ] **Step 6: Escribir las 6 FAQ**

Literales de `/nosotros`: qué es el pilates máquina, cómo practicarlo, cuántas veces por semana, si puede uno lesionarse, para qué edad, qué beneficios tiene. Corregir sólo los typos evidentes del original ("cuerponpara" → "cuerpo para", "ocurrír" → "ocurrir").

- [ ] **Step 7: Escribir las 3 entradas de blog de ejemplo**

Contenido real sobre pilates, marcado como contenido de muestra en `docs/CONTENT.md`. El "Hello world!" no se replica.

- [ ] **Step 8: Ejecutar el test y verificar que pasa**

Run: `npx playwright test tests/content-schema.spec.ts`
Expected: PASS — la compilación falla con el servicio sin icono

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: colecciones de contenido validadas con Zod"
```

---

## Task 5: Primitivas de interfaz

**Files:**
- Create: `src/components/ui/Button.astro`, `Card.astro`, `Accordion.astro`, `RatingBadge.astro`, `SectionHeading.astro`, `Icon.astro`

**Interfaces:**
- Produces:
  - `Button` — props `{ href: string; variant?: 'solid' | 'green' | 'outline'; class?: string }`
  - `Card` — props `{ as?: string; class?: string }`, contenido por slot
  - `Accordion` — props `{ items: Array<{ pregunta: string; html: string }> }`, basado en `<details>`/`<summary>`
  - `RatingBadge` — props `{ label: string; count: number; source: string; href?: string }`
  - `SectionHeading` — props `{ kicker: string; title: string; align?: 'left' | 'center' }`
  - `Icon` — props `{ name: string; size?: number }`, SVG en línea

- [ ] **Step 1: Escribir `RatingBadge.astro`**

Cae fuera del contenedor recortado por diseño: el consumidor lo coloca como hermano de la figura, nunca dentro de un elemento con `overflow: hidden`. Este fue un bug real en el mockup.

```astro
---
interface Props { label: string; count: number; source: string; href?: string; }
const { label, count, source, href } = Astro.props;
const Tag = href ? 'a' : 'div';
const aria = `Valoración ${label.toLowerCase()} en ${count} reseñas de ${source}`;
---
<Tag class="badge" href={href} aria-label={href ? aria : undefined}>
  <span class="left">
    <span class="stars" aria-hidden="true">★★★★★</span>
    <span class="label">{label}</span>
  </span>
  <span class="meta">{count} reseñas<br />en {source}</span>
</Tag>
<style>
  .badge { position: absolute; left: -1.6rem; bottom: 2.6rem; z-index: 3; display: flex; align-items: center; gap: 0.7rem; min-height: 44px; background: var(--surf); border-radius: var(--radius-m); padding: 0.875rem 1.125rem; box-shadow: 0 0.875rem 2.4rem rgb(62 28 74 / 0.15); text-decoration: none; white-space: nowrap; transition: box-shadow 0.25s, transform 0.25s; }
  .badge:hover { box-shadow: 0 1.1rem 2.75rem rgb(62 28 74 / 0.24); }
  .stars { display: block; color: var(--star); font-size: 0.8rem; letter-spacing: 1.5px; }
  .label { display: block; font-family: var(--font-display); font-size: var(--step-1); color: var(--mor); }
  .meta { font-size: var(--step--1); letter-spacing: 0.1em; text-transform: uppercase; color: #7a5a80; }
  @media (max-width: 53.75rem) { .badge { left: 0.75rem; bottom: -1.1rem; padding: 0.7rem 0.95rem; } }
</style>
```

- [ ] **Step 2: Escribir `Accordion.astro` con `<details>` nativo**

Funciona sin JavaScript. Es el requisito 3 de Review Focus.

```astro
---
interface Props { items: Array<{ pregunta: string; html: string }>; }
const { items } = Astro.props;
---
<div class="acc">
  {items.map((item) => (
    <details>
      <summary>{item.pregunta}<span class="chev" aria-hidden="true">+</span></summary>
      <div class="body" set:html={item.html} />
    </details>
  ))}
</div>
<style>
  details { border-bottom: 1px solid var(--line); }
  summary { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 44px; padding: 1.25rem 0; cursor: pointer; font-family: var(--font-display); font-size: var(--step-1); color: var(--ink); list-style: none; }
  summary::-webkit-details-marker { display: none; }
  .chev { flex: none; font-size: 1.5rem; color: var(--mor); transition: transform 0.25s; }
  details[open] .chev { transform: rotate(45deg); }
  .body { padding-bottom: 1.5rem; }
</style>
```

- [ ] **Step 3: Escribir `Button`, `Card`, `SectionHeading`, `Icon`**

`Icon.astro` mantiene un mapa de los siete nombres del enum de `servicios` a paths SVG en línea. Sin fuente de iconos: su web carga FontAwesome y ETmodules enteros para unos pocos glifos.

- [ ] **Step 4: Verificar la compilación**

Run: `npm run check && npm run build`
Expected: sin errores de tipo, compilación correcta

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: primitivas de interfaz sin dependencias del dominio"
```

---

## Task 6: Cabecera, pie y elementos persistentes

**Files:**
- Create: `src/components/layout/Header.astro`, `Nav.astro`, `Footer.astro`, `WhatsAppFab.astro`, `SkipLink.astro`
- Test: `tests/a11y.spec.ts`, ampliar `tests/routes.spec.ts`

**Interfaces:**
- Consumes: `site` de la Tarea 3
- Produces: cabecera pegajosa con clase `.shrunk` al hacer scroll, navegación móvil por `<details>`, pie con NAP y formulario de newsletter

- [ ] **Step 1: Escribir el test de accesibilidad y de contactos pulsables**

`tests/a11y.spec.ts`:

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const rutas = ['/', '/nosotros', '/blog', '/aviso-legal', '/privacidad', '/cookies'];

for (const ruta of rutas) {
  test(`${ruta} no tiene incidencias graves de accesibilidad`, async ({ page }) => {
    await page.goto(ruta);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(r.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? ''))).toEqual([]);
  });
}

test('el teléfono y el email son pulsables', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('a[href="tel:+34611789488"]').first()).toBeVisible();
  await expect(page.locator('a[href="mailto:info@supilatesbyflor.com"]').first()).toBeVisible();
});

test('la navegación funciona sin JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('a[href$="/nosotros"]').first()).toBeVisible();
  await ctx.close();
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx playwright test tests/a11y.spec.ts`
Expected: FAIL — las rutas legales no existen y no hay enlaces `tel:`

- [ ] **Step 3: Escribir `SkipLink.astro`**

Enlace a `#contenido`, oculto hasta recibir foco.

- [ ] **Step 4: Escribir `Header.astro` y `Nav.astro`**

Cabecera `position: sticky`. El menú móvil usa `<details>` para funcionar sin JS (requisito 3 de Review Focus). El teléfono aparece como `<a href={site.phoneHref}>` — corrige el hallazgo 6 de la auditoría.

- [ ] **Step 5: Escribir `Footer.astro`**

NAP completo con `tel:` y `mailto:`, horarios desde `site.hours`, Instagram, formulario de newsletter, y enlaces a las tres páginas legales. Rótulos en español: "Teléfono", no "Phone" (hallazgo 7). Sin el texto "Mensaje de éxito" (hallazgo 3).

El formulario no tiene backend: `<form>` sin `action`, con un manejador que muestra un mensaje de "próximamente". El campo lleva `<label>` asociado.

- [ ] **Step 6: Escribir `WhatsAppFab.astro`**

Botón flotante de 56 px, oculto hasta pasar el 55 % del alto de ventana, con `aria-label`. Enlace a `site.whatsapp`.

- [ ] **Step 7: Ejecutar los tests y verificar que pasan**

Run: `npx playwright test tests/a11y.spec.ts`
Expected: los tests de `/` pasan; las rutas legales siguen fallando hasta la Tarea 11

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: cabecera, pie y contactos pulsables"
```

---

## Task 7: Secciones de la home

**Files:**
- Create: `src/components/sections/Hero.astro`, `TrustBar.astro`, `Metodo.astro`, `Banda.astro`, `Servicios.astro`, `Horarios.astro`, `Testimonios.astro`, `CtaFinal.astro`
- Modify: `src/pages/index.astro`
- Test: `tests/responsive.spec.ts`

**Interfaces:**
- Consumes: `site`, colecciones `servicios` y `testimonios`, primitivas de la Tarea 5
- Produces: `Servicios` recibe `{ items: CollectionEntry<'servicios'>[] }`; `Testimonios` recibe `{ items: CollectionEntry<'testimonios'>[] }`. Ninguna sección consulta colecciones por su cuenta: la página las inyecta.

- [ ] **Step 1: Escribir el test de responsive**

`tests/responsive.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

const anchos = [320, 390, 768, 1280, 1920];
const rutas = ['/', '/nosotros', '/blog'];

for (const ruta of rutas) {
  for (const width of anchos) {
    test(`${ruta} a ${width}px no produce scroll horizontal`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(ruta);
      const desborda = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(desborda).toBe(false);
    });
  }
}

test('las áreas pulsables llegan a 44px en móvil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  for (const el of await page.locator('a.btn, .fab, header a').all()) {
    if (!(await el.isVisible())) continue;
    const box = await el.boundingBox();
    if (box) expect(box.height).toBeGreaterThanOrEqual(44);
  }
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx playwright test tests/responsive.spec.ts`
Expected: FAIL — `/nosotros` y `/blog` no existen todavía

- [ ] **Step 3: Escribir `Hero.astro`**

Estructura crítica — el badge va **fuera** del contenedor con `overflow: hidden`:

```astro
<div class="hero-figure">
  <div class="hero-media"><Image src={heroImg} alt="Clase de pilates con máquina en el estudio" widths={[480, 800, 1200]} loading="eager" fetchpriority="high" /></div>
  <RatingBadge label={site.reviews.label} count={site.reviews.count} source={site.reviews.source} href="#testimonios" />
</div>
```

`.hero-media` lleva `overflow: hidden` y el `border-radius` elíptico; `.hero-figure` es `position: relative` sin recorte.

- [ ] **Step 4: Escribir `TrustBar.astro`**

Cuatro datos: reseñas (enlace a `#testimonios`), duración de clase, alumnas por grupo, meses abierto. Los contadores animan; sin JS muestran el valor final, que es el contenido inicial del HTML.

- [ ] **Step 5: Escribir `Metodo.astro`, `Banda.astro`, `Servicios.astro`, `Horarios.astro`, `Testimonios.astro`, `CtaFinal.astro`**

`Testimonios.astro` lleva `id="testimonios"` — es el destino del badge y de la barra de confianza. `Banda.astro` es sólo fotografía, sin texto superpuesto.

- [ ] **Step 6: Componer `src/pages/index.astro`**

La página consulta `getCollection('servicios')` y `getCollection('testimonios')`, ordena por `orden` e inyecta por props.

- [ ] **Step 7: Ejecutar el test a 320px y verificar que pasa para `/`**

Run: `npx playwright test tests/responsive.spec.ts --grep "^/ a"`
Expected: PASS en los cinco anchos

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: secciones de la home"
```

---

## Task 8: Efectos de scroll

**Files:**
- Create: `src/scripts/scroll.ts`
- Modify: `src/layouts/BaseLayout.astro` (cargar el script)
- Test: `tests/motion.spec.ts`

**Interfaces:**
- Consumes: clases `.rv`, `#nav`, `#band`, `#tint`, `#cta`, `#fab`, `[data-count]` puestas por las Tareas 6 y 7
- Produces: ninguna exportación; efecto lateral sobre el documento

- [ ] **Step 1: Escribir el test de reduced-motion**

`tests/motion.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test.describe('con prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce' });

  test('todo el contenido queda visible y sin desplazar', async ({ page }) => {
    await page.goto('/');
    for (const el of await page.locator('.rv').all()) {
      const est = await el.evaluate((n) => {
        const s = getComputedStyle(n);
        return { opacity: Number(s.opacity), transform: s.transform };
      });
      expect(est.opacity).toBe(1);
      expect(['none', 'matrix(1, 0, 0, 1, 0, 0)']).toContain(est.transform);
    }
  });

  test('los contadores muestran su valor final', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-count="89"]')).toHaveText('89');
  });
});

test('sin reduced-motion los elementos aparecen al hacer scroll', async ({ page }) => {
  await page.goto('/');
  const svc = page.locator('#servicios .rv').first();
  await svc.scrollIntoViewIfNeeded();
  await expect(svc).toHaveClass(/\bin\b/, { timeout: 3000 });
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

Run: `npx playwright test tests/motion.spec.ts`
Expected: FAIL — sin el script, `.rv` nunca recibe `.in`

- [ ] **Step 3: Escribir `src/scripts/scroll.ts`**

Guardia de reduced-motion arriba del todo. Reveals y contadores con `IntersectionObserver`; parallax, banda y viraje con un único manejador de scroll pasivo y `requestAnimationFrame`.

```ts
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

const io = new IntersectionObserver((es) => {
  for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.rv').forEach((el) => (reduce ? el.classList.add('in') : io.observe(el)));

document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const to = Number(el.dataset.count);
  if (reduce) { el.textContent = String(to); return; }
  const obs = new IntersectionObserver((es) => {
    for (const e of es) {
      if (!e.isIntersecting) continue;
      obs.unobserve(e.target);
      const t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min((t - t0) / 1100, 1);
        el.textContent = String(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, { threshold: 0.6 });
  obs.observe(el);
});
```

Más el manejador de scroll para la cabecera, el FAB, el parallax del hero, el ancho de la banda y la opacidad del tinte — todo tras `if (reduce) return;` salvo la cabecera, el FAB y la barra de progreso, que son funcionales y siguen activos.

- [ ] **Step 4: Cargar el script en `BaseLayout.astro`**

```astro
<script>import '../scripts/scroll';</script>
```

- [ ] **Step 5: Ejecutar los tests y verificar que pasan**

Run: `npx playwright test tests/motion.spec.ts`
Expected: PASS — los tres tests

- [ ] **Step 6: Verificar el presupuesto de JavaScript**

Run: `npm run build && find dist -name '*.js' -exec gzip -c {} \; | wc -c`
Expected: menos de 15360 bytes

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: ocho efectos de scroll con respaldo de reduced-motion"
```

---

## Task 9: Página Nosotros

**Files:**
- Create: `src/pages/nosotros.astro`, `src/components/sections/Beneficios.astro`, `Faq.astro`
- Test: ampliar `tests/routes.spec.ts`

**Interfaces:**
- Consumes: colecciones `faq` y `testimonios`, `Accordion` de la Tarea 5

- [ ] **Step 1: Escribir el test de la ruta**

```ts
test('/nosotros tiene FAQ que funciona sin JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto('/nosotros');
  const primera = page.locator('details').first();
  await primera.locator('summary').click();
  await expect(primera).toHaveAttribute('open', '');
  await ctx.close();
});
```

- [ ] **Step 2: Ejecutar y verificar que falla** — la ruta no existe

- [ ] **Step 3: Escribir `Beneficios.astro`** con el texto largo literal de su web (los ocho beneficios del pilates con máquina)

- [ ] **Step 4: Escribir `Faq.astro`** que envuelve `Accordion` con las entradas de la colección

- [ ] **Step 5: Componer `src/pages/nosotros.astro`**

- [ ] **Step 6: Ejecutar los tests y verificar que pasan**

- [ ] **Step 7: Commit** — `feat: página nosotros con beneficios y FAQ`

---

## Task 10: Blog

**Files:**
- Create: `src/pages/blog/index.astro`, `src/pages/blog/[...slug].astro`, `src/layouts/PostLayout.astro`
- Test: ampliar `tests/routes.spec.ts`

**Interfaces:**
- Consumes: colección `blog`
- Produces: `getStaticPaths` desde las entradas no marcadas como borrador

- [ ] **Step 1: Escribir el test, incluido el caso de colección vacía**

```ts
test('/blog lista las entradas', async ({ page }) => {
  await page.goto('/blog');
  expect(await page.locator('article').count()).toBeGreaterThan(0);
  await expect(page.getByText('Hello world')).toHaveCount(0);
});

test('cada entrada tiene su página', async ({ page }) => {
  await page.goto('/blog');
  await page.locator('article a').first().click();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('time')).toHaveCount(1);
});
```

Y para el requisito 5 de Review Focus, un test que renderiza el estado vacío moviendo temporalmente las entradas:

```ts
test('una colección de blog vacía muestra estado vacío, no un error', () => {
  const tmp = 'src/content/.blog-tmp';
  renameSync('src/content/blog', tmp);
  try {
    execFileSync('npx', ['astro', 'build'], { stdio: 'pipe' });
    expect(readFileSync('dist/blog/index.html', 'utf8')).toContain('Pronto habrá');
  } finally {
    renameSync(tmp, 'src/content/blog');
  }
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

- [ ] **Step 3: Escribir `PostLayout.astro`** con `<time datetime>` y navegación de vuelta al listado

- [ ] **Step 4: Escribir `src/pages/blog/index.astro`**

Filtra `borrador`, ordena por `fecha` descendente, y renderiza el estado vacío con el texto "Pronto habrá artículos aquí." cuando no hay entradas.

- [ ] **Step 5: Escribir `src/pages/blog/[...slug].astro`** con `getStaticPaths`

- [ ] **Step 6: Ejecutar los tests y verificar que pasan**

- [ ] **Step 7: Commit** — `feat: blog con listado, entradas y estado vacío`

---

## Task 11: Página 404 y páginas legales

**Files:**
- Create: `src/pages/404.astro`, `aviso-legal.astro`, `privacidad.astro`, `cookies.astro`

- [ ] **Step 1: Escribir el test**

```ts
test('una ruta inexistente devuelve 404', async ({ page }) => {
  const res = await page.goto('/ruta-que-no-existe');
  expect(res?.status()).toBe(404);
});

test('las páginas legales advierten de que son plantilla', async ({ page }) => {
  for (const r of ['/aviso-legal', '/privacidad', '/cookies']) {
    await page.goto(r);
    await expect(page.getByRole('note')).toContainText('revisión jurídica');
  }
});
```

- [ ] **Step 2: Ejecutar y verificar que falla**

- [ ] **Step 3: Escribir las cuatro páginas**

Cada página legal abre con un aviso `role="note"` que dice que es una plantilla pendiente de revisión jurídica y no constituye asesoramiento legal. Contenido sobre el tratamiento del email de la newsletter, sin cookies de terceros (no hay analítica ni fuentes externas, así que no hace falta banner).

- [ ] **Step 4: Ejecutar los tests completos y verificar que pasan**

Run: `npx playwright test`
Expected: PASS en toda la suite, incluidos los tests de accesibilidad de la Tarea 6 que esperaban estas rutas

- [ ] **Step 5: Commit** — `feat: 404 y páginas legales`

---

## Task 12: Imágenes y logo

**Files:**
- Create: `src/assets/images/*`, `public/og.jpg`, `public/favicon.svg`
- Create: `src/assets/logo.svg`
- Modify: los componentes que usan `<Image />`

- [ ] **Step 1: Descargar las imágenes de stock elegidas**

Las cinco de Unsplash validadas en el brainstorming, a resolución completa. Guardar en `src/assets/images/` con nombres descriptivos.

- [ ] **Step 2: Descargar el logo original y vectorizarlo**

Origen: `https://supilatesbyflor.com/wp-content/uploads/2026/03/Pilates-Logo-sin-fondo-300x300-1.png` (512×512, PNG con transparencia). Vectorizar a SVG con los colores de marca `#82008C` y `#32D232`. El logo es suyo y se conserva sin cambios de forma.

- [ ] **Step 3: Generar `public/og.jpg`**

1200×630, logo sobre el fondo hueso con el lema. Es la imagen que aparecerá cuando alguien comparta el enlace por WhatsApp — corrige el hallazgo 9.

- [ ] **Step 4: Sustituir las etiquetas `<img>` por `<Image />` de `astro:assets`**

Con `widths` explícitos, `format="webp"`, `loading="lazy"` salvo el hero, y `alt` descriptivo en español.

- [ ] **Step 5: Verificar que no hay desplazamiento de diseño**

Run: `npx playwright test tests/responsive.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit** — `feat: imágenes optimizadas y logo vectorizado`

---

## Task 13: Documentación

**Files:**
- Create: `README.md`, `docs/ARCHITECTURE.md`, `docs/CONTENT.md`, `docs/AUDIT.md`, `docs/adr/0001-astro-sobre-wordpress.md`, `docs/adr/0002-css-propio-sobre-tailwind.md`, `docs/adr/0003-noindex-en-la-demo.md`

- [ ] **Step 1: Escribir `docs/AUDIT.md`**

La sección 2 del spec como documento presentable: los 12 hallazgos con su corrección, la tabla de resoluciones de imagen, y lo que su web hace bien. Es el documento que se le puede enseñar si pide detalle.

- [ ] **Step 2: Escribir `docs/CONTENT.md`**

Tabla origen → destino de cada texto y cada imagen, con licencia. Marca explícitamente qué imagen es suya (el logo) y cuál es de stock, y cuáles son las 3 entradas de blog de muestra.

- [ ] **Step 3: Escribir `docs/ARCHITECTURE.md`**

Estructura, límites entre unidades, por qué las secciones reciben props en vez de consultar colecciones.

- [ ] **Step 4: Escribir los tres ADR y el `README.md`**

- [ ] **Step 5: Commit** — `docs: arquitectura, contenido, auditoría y ADR`

---

## Task 14: Despliegue y verificación de presupuesto

**Files:**
- Create: `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`, `lighthouserc.json`

- [ ] **Step 1: Escribir `ci.yml`**

En cada push y pull request: `npm ci`, `npm run check`, `npm run build`, `npx playwright test`.

- [ ] **Step 2: Escribir `lighthouserc.json`**

Asserts: `categories:performance >= 0.95`, `accessibility >= 0.95`, `best-practices >= 0.95`, `seo >= 0.95`, `cumulative-layout-shift < 0.05`. Nota: la categoría SEO puntúa el `noindex` como problema — se añade `"seo:is-crawlable": "off"`, porque el `noindex` es deliberado y está justificado en el spec.

- [ ] **Step 3: Escribir `deploy.yml`**

`actions/configure-pages`, `upload-pages-artifact` desde `dist/`, `deploy-pages`. Sólo en push a `main`.

- [ ] **Step 4: Ejecutar la suite completa en local**

Run: `npm run check && npm run build && npx playwright test`
Expected: PASS en todo

- [ ] **Step 5: Medir el HTML de la home**

Run: `gzip -c dist/index.html | wc -c`
Expected: menos de 25600 bytes. Anotar el número en `docs/AUDIT.md` junto al de su web (151 KB sin comprimir).

- [ ] **Step 6: Empujar la rama y abrir el pull request**

```bash
git push -u origin feat/initial-build
gh pr create --title "Rediseño estático de Su Pilates by Flor" --body "..."
```

- [ ] **Step 7: Commit** — `ci: despliegue a GitHub Pages y presupuesto Lighthouse`

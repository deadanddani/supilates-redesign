# Arquitectura

Sitio estático en Astro 7 sin framework de interfaz. Este documento explica cómo está
dividido y por qué cada límite está donde está.

## Principio

Tres decisiones estructurales sostienen el resto:

1. **El contenido vive fuera del código.** Servicios, testimonios, preguntas frecuentes y
   artículos son archivos Markdown. Añadir un servicio es crear un archivo.
2. **Un único origen para los datos de contacto.** `src/data/site.ts`.
3. **El contenido malformado rompe la compilación.** Los esquemas Zod de
   `src/content.config.ts` no dejan publicar una página incompleta.

La tercera es la red que la web original no tiene: por eso lleva publicado el artículo de
ejemplo de WordPress.

## Estructura

```
src/
├── data/site.ts           Teléfono, email, dirección, horarios, WhatsApp, reseñas
├── content.config.ts      Esquemas Zod de las cuatro colecciones
├── content/               Markdown: servicios, testimonios, faq, blog
├── styles/
│   ├── tokens.css         Custom properties: color, tipografía, espacio, forma
│   └── global.css         Reset, base, utilidades, reduced-motion
├── layouts/
│   ├── BaseLayout.astro   <head>, JSON-LD, cabecera, pie, botón flotante
│   ├── PostLayout.astro   Artículo del blog
│   └── LegalLayout.astro  Páginas legales, con su aviso de plantilla
├── components/
│   ├── ui/                Primitivas sin conocimiento del dominio
│   ├── layout/            Cabecera, navegación, pie, persistentes
│   └── sections/          Secciones de página
├── scripts/scroll.ts      Los ocho efectos ligados al scroll
└── pages/                 Consultan colecciones e inyectan props
```

## Límites entre unidades

**`ui/` no conoce el dominio.** `Card` no sabe qué es un servicio. `Accordion` recibe una
lista de `{ pregunta, Contenido }` y no sabe que son preguntas frecuentes. Se pueden usar en
cualquier página.

**`sections/` recibe sus datos por props y nunca consulta colecciones.** Quien consulta es
la página. Así una sección se monta en cualquier ruta y se puede probar aislada.

```astro
---
// src/pages/index.astro — la página consulta
const servicios = (await getCollection('servicios')).sort((a, b) => a.data.orden - b.data.orden);
---
<Servicios items={servicios} />   <!-- la sección solo recibe -->
```

**`layout/` depende de `site.ts` y de nada más.** Cambiar el teléfono es editar una línea y
se propaga a la cabecera, el pie, los enlaces `tel:` y el JSON-LD a la vez.

## Advertencia sobre `RatingBadge`

Se posiciona en absoluto y **sobresale por el borde izquierdo a propósito**. Debe colocarse
como hermano de la figura, en un contenedor `position: relative` **sin** `overflow: hidden`.

Meterlo dentro del contenedor recortado de la fotografía lo parte por la mitad. Ocurrió en
el mockup de diseño y está documentado en el propio componente.

## Movimiento

`src/scripts/scroll.ts`, 1113 bytes comprimidos, sin librerías:

- `IntersectionObserver` para las apariciones y los contadores
- Un único manejador de scroll pasivo con `requestAnimationFrame` para el parallax, la
  banda expansiva y el viraje de fondo

`prefers-reduced-motion: reduce` desactiva los efectos **decorativos**. La cabecera que se
compacta, el botón de WhatsApp y la barra de progreso siguen activos: son funcionales.

El respaldo está en CSS, no solo en JavaScript: `.rv` recupera `opacity: 1` en la media
query, así que la página es legible aunque el script no llegue a ejecutarse.

## Verificación

| Capa | Herramienta | Qué garantiza |
| --- | --- | --- |
| Contenido | Zod | La compilación falla ante frontmatter malformado |
| Tipos | `astro check` | Sin errores de tipo |
| Rutas | Playwright | Las 8 rutas responden 200; la inexistente responde 404 |
| Accesibilidad | `@axe-core/playwright` | Cero incidencias graves por ruta |
| Color | Test propio | Las 7 parejas texto/fondo superan 4.5:1 |
| Responsive | Playwright | Sin scroll horizontal de 320 a 1920 px |
| Movimiento | Playwright | Con reduced-motion nada queda invisible |

`npm run check && npm run build && npm test`

## Qué añadir si el proyecto avanza

- **CMS:** Decap corre sobre este mismo repositorio, gratis, y edita las colecciones Markdown
  sin tocar componentes.
- **Alta de boletín:** el formulario valida en cliente pero no tiene backend. Es el único
  punto que necesita un servicio externo.
- **Reservas:** hoy todo va a WhatsApp, igual que en la web original.

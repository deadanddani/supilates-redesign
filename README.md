# Su Pilates by Flor — propuesta de rediseño

Réplica estática y rediseñada de [supilatesbyflor.com](https://supilatesbyflor.com/),
construida como propuesta comercial: paridad funcional completa con la web actual, con sus
textos y su logotipo, y los doce defectos detectados corregidos.

> **Esta demostración no se indexa.** Todas las páginas sirven `noindex, nofollow`.
> Replica los textos de un negocio real en activo; indexarla crearía contenido duplicado que
> competiría con su propia web. Ver `docs/adr/0003-noindex-en-la-demo.md`.

## Arrancar

```bash
npm install
npm run dev        # http://localhost:4321/supilates-redesign
```

## Comprobar

```bash
npm run check      # tipos
npm run build      # compila a dist/
npm test           # Playwright: rutas, accesibilidad, color, responsive, movimiento
```

La suite cubre las 8 rutas, cero incidencias graves de accesibilidad, las 7 parejas de color
a WCAG AA, ausencia de scroll horizontal de 320 a 1920 px, y que con `prefers-reduced-motion`
no quede ningún elemento invisible.

## Estructura

| Ruta | Contenido |
| --- | --- |
| `/` | Hero, barra de confianza, el método, servicios, horarios, testimonios, CTA |
| `/nosotros` | Testimonios, beneficios del pilates con máquina, preguntas frecuentes |
| `/blog` | Listado de artículos |
| `/blog/[slug]` | Artículo |
| `/aviso-legal`, `/privacidad`, `/cookies` | Páginas legales (plantilla) |
| `/404` | No encontrada |

## Editar contenido

Sin tocar componentes:

- **Datos de contacto:** `src/data/site.ts`
- **Servicios, testimonios, preguntas, artículos:** `src/content/*/`
- **Color y tipografía:** `src/styles/tokens.css`

El frontmatter está validado con Zod. Un campo ausente o mal tipado **rompe la compilación**
en vez de publicar una página incompleta.

## Documentación

| Documento | Contenido |
| --- | --- |
| `docs/AUDIT.md` | Los doce defectos de la web actual, con su dato y su corrección |
| `docs/ARCHITECTURE.md` | Estructura, límites entre unidades, verificación |
| `docs/CONTENT.md` | Origen y licencia de cada texto e imagen |
| `docs/DESIGN-SYSTEM.md` | Tokens, tipografía, movimiento, accesibilidad |
| `docs/adr/` | Decisiones estructurales |

## Antes de enseñárselo

Seis datos salen de su web sin confirmar. Ver `docs/CONTENT.md`:

- [ ] `wa.link/4oru75` sigue vivo
- [ ] Teléfono, email y dirección
- [ ] Recuento de reseñas y la nota real de su ficha de Google
- [ ] Medir ambas webs con Lighthouse en idénticas condiciones
- [ ] Abrir la demo en un móvil real

## Stack

Astro 7 estático · TypeScript estricto · CSS propio con tokens · contenido en Markdown
validado con Zod · fuentes autoalojadas · sin framework de interfaz · 1113 bytes de
JavaScript comprimidos.

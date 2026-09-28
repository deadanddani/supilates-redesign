# Sistema de diseño

Dirección: **editorial tranquilo, un solo acento**. Mantiene la identidad reconocible (el
morado del logo, la foto del arco en el hero) y retira todo lo que competía con ella.

El morado (`#82008C`) y el verde (`#32D232`) del logo son muy saturados. Usados a pantalla
completa pelean con la fotografía y dan un resultado ruidoso. Aquí el morado es **el único
acento** de la página: todos los botones de acción son morados. Los neutros están teñidos de
ese mismo morado (fondo blanco lila, texto berenjena), así que la web habla en una sola familia
de color. El verde queda reservado al botón flotante de WhatsApp, donde es una señal
reconocible y no un segundo acento.

## Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--bone` | `#f8f5f9` | Fondo principal: blanco con un punto de lila |
| `--surf` | `#fdfcfd` | Superficies elevadas |
| `--ink` | `#2f1537` | Titulares |
| `--body` | `#574a5d` | Texto corrido |
| `--mor` | `#7d1f8f` | Morado de marca, única acción principal |
| `--mor-h` | `#6a1879` | Morado al pasar el ratón |
| `--mor-d` | `#2f1537` | Fondos oscuros (CTA final, pie) |
| `--verde` | `#2e7d32` | Verde de marca, solo si hace falta sobre blanco |
| `--lila` | `#efe7f2` | Fondo de sección y celdas |
| `--line` | `#e4d8e8` | Líneas finas |
| `--star` | `#8a6510` | Estrellas de valoración |
| `--muted` | `#6b5572` | Rótulos secundarios |

Las sombras (`--shadow-s`, `--shadow-m`) están teñidas del morado profundo, nunca negras.

### Dos tokens que se apartan del logo, y por qué

**`--verde`: de `#32d232` a `#2e7d32`.** El verde original da **2,0:1** con texto blanco
encima, muy por debajo del 4,5:1 que exige WCAG AA. El tono rebajado da 5,1:1.

**`--star`: de `#e3a21a` a `#8a6510`.** Mismo motivo sobre fondo blanco.

Las siete parejas texto/fondo están verificadas en `tests/contrast.spec.ts`. **El test lee
los tokens del CSS compilado**, así que bajar un valor por debajo de 4,5:1 rompe la suite.

## Tipografía

- **Bricolage Grotesque** (sans variable, con eje óptico) para titulares. Peso 560, tracking
  negativo. Tiene carácter sin caer en la serif editorial por defecto, y encaja con el trazo
  desenfadado del logo.
- **Figtree** (sans variable) para texto, interfaz y rótulos.

Bricolage no tiene cursiva: el acento dentro de un titular (`<em>`) es **color morado y peso
400**, nunca una oblicua sintética.

Sustituyen a Fraunces, que a su vez sustituyó a Domine + Open Sans de Divi.

Ambas **autoalojadas** con `@fontsource-variable`. Ninguna petición a Google Fonts: evita una
conexión externa y que la IP del visitante llegue a un tercero.

### Escala

Fluida con `clamp()`, de `--step--1` a `--step-5`, sin saltos en los puntos de ruptura.

El titular del hero lleva **escala propia** (`clamp(2.5rem, 1.5rem + 3.4vw, 4.25rem)`) y una
columna de texto más ancha que la foto (1,3 / 0,7): así cabe en **dos líneas** en escritorio.

### Rótulos

Como mucho **un rótulo en mayúsculas por página** (el del hero o el de la portada). Las
secciones se presentan solo con su titular.

## Espacio y forma

`--space-xs` a `--space-xl`, los dos últimos fluidos. Ancho de contenido `--wrap` = 74 rem.
El margen lateral es `--pad-l` / `--pad-r`: el `--gutter` fluido, o el safe area del móvil si
es mayor (el viewport usa `viewport-fit=cover`).

Una sola regla de radios:

| Pieza | Radio |
| --- | --- |
| Botones y píldoras | `--radius-pill` |
| Fotos, paneles, celdas | `--radius-l` (1,25 rem) |
| Piezas interiores | `--radius-m` (0,75 rem) |
| Campos de formulario | `--radius-s` (0,5 rem) |

`--tap: 44px` es el área pulsable mínima. `tests/responsive.spec.ts` lo comprueba a 390 px.

## Una acción, una etiqueta

Toda la web tiene una sola acción: escribir por WhatsApp. Se llama igual en todas partes,
**«Reserva tu clase»** (`site.cta`), en la cabecera, el hero, servicios, horarios y el CTA
final. Las acciones secundarias («Ver horarios», «Ver las clases») son enlaces de texto con
flecha, no un segundo botón.

## Composición de la home

Cada sección usa una familia de composición distinta:

| Sección | Composición |
| --- | --- |
| Hero | Texto a la izquierda, foto en arco a la derecha |
| Datos | Cuatro columnas con líneas finas, sin tarjeta |
| El método | Texto fijo + collage asimétrico con pies debajo de cada foto |
| Banda | Foto a sangre |
| Servicios | Bento: 7 servicios, 7 celdas, la destacada en morado |
| Horarios | Panel lila con tabla tipográfica de horas |
| Testimonios | Muro en columnas (masonry) |
| CTA final | Panel morado profundo, centrado |

## Movimiento

Sin escuchar el evento `scroll`:

| Efecto | Cómo | Dónde |
| --- | --- | --- |
| Entrada al cargar | Animación CSS escalonada | Hero |
| Parallax de la foto | `animation-timeline: view()` | Hero |
| Cabecera compacta | IntersectionObserver sobre un centinela | Global |
| Botón de WhatsApp | IntersectionObserver sobre un centinela | Global |
| Barra de progreso | `animation-timeline: scroll()` | Global |
| Contadores | IntersectionObserver | Datos |
| Texto fijo y fotos que desfilan | `position: sticky` | El método, FAQ |
| La foto se abre a sangre | `clip-path` + `view()` | Banda |
| Aparición en cascada | IntersectionObserver + `.rv` | Resto de secciones |

Donde el navegador no soporta `animation-timeline`, esos efectos simplemente no se ven: la
página queda quieta y completa.

### Reduced motion no es opcional

El estudio atiende a tercera edad, embarazo y rehabilitación. `prefers-reduced-motion: reduce`
desactiva todos los efectos decorativos. Siguen activos la cabecera compacta y el botón de
WhatsApp: son funcionales.

**El respaldo vive en CSS, no solo en JavaScript.** `.rv` recupera `opacity: 1` con
reduced-motion y también con `scripting: none`, así que la página se lee aunque el script
nunca llegue a ejecutarse. `tests/motion.spec.ts` lo comprueba.

## Responsive

Diseñado desde el móvil. Verificado a 320, 390, 768, 1024, 1280, 1440 y 1920 px.
`tests/layout.spec.ts` comprueba que no hay scroll horizontal en ninguna página pública a
390 × 844, 768 × 1024 y 1440 × 900, y que los elementos clave de la home están a la vista.

En móvil: navegación desplegable con `<details>`, botón flotante de WhatsApp, collage del
método a dos columnas, bento a una columna y `position: sticky` desactivado.

## Tema

Solo claro (`color-scheme: light`). Es la identidad de la marca. Un modo oscuro queda fuera
del alcance de este rediseño.

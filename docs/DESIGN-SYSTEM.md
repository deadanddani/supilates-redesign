# Sistema de diseño

Dirección: **editorial cálido**. Mantiene la identidad reconocible bajando el volumen, en
vez de competir con ella.

El morado (`#82008C`) y el verde (`#32D232`) del logo son muy saturados. Usados a pantalla
completa pelean con la fotografía y dan un resultado ruidoso. Aquí el morado conserva el
papel principal, el verde baja a acento, y el fondo pasa de blanco puro a hueso para que las
fotografías respiren.

## Color

| Token | Valor | Uso |
| --- | --- | --- |
| `--bone` | `#f7f3ee` | Fondo principal |
| `--surf` | `#ffffff` | Superficies elevadas |
| `--ink` | `#3f1c4a` | Titulares |
| `--body` | `#5c4a62` | Texto corrido |
| `--mor` | `#7d1f8f` | Morado de marca, acción principal |
| `--mor-d` | `#3f1c4a` | Fondos oscuros |
| `--verde` | `#2e7d32` | Verde de marca, CTA de WhatsApp |
| `--lila` | `#f0e8f2` | Fondo de sección |
| `--line` | `#e7dcea` | Bordes |
| `--star` | `#8a6510` | Estrellas de valoración |
| `--muted` | `#6b4f72` | Rótulos secundarios |

### Dos tokens que se apartan del logo, y por qué

**`--verde`: de `#32d232` a `#2e7d32`.** El verde original da **2,0:1** con texto blanco
encima, muy por debajo del 4,5:1 que exige WCAG AA. El botón de WhatsApp sería ilegible.
El tono rebajado da 5,1:1.

**`--star`: de `#e3a21a` a `#8a6510`.** Mismo motivo sobre fondo blanco.

Las siete parejas texto/fondo están verificadas en `tests/contrast.spec.ts`. **El test lee
los tokens del CSS compilado**, así que bajar un valor por debajo de 4,5:1 rompe la suite.

## Tipografía

- **Fraunces** (serif variable) para titulares. La cursiva marca los acentos.
- **Figtree** (sans variable) para texto, interfaz y rótulos.

Sustituyen a Domine + Open Sans, que son los valores por defecto de Divi.

Ambas **autoalojadas** con `@fontsource-variable`. Ninguna petición a Google Fonts: evita una
conexión externa y que la IP del visitante llegue a un tercero, que en la UE ha generado
sentencias por RGPD.

### Escala

Fluida con `clamp()`, de `--step--1` a `--step-5`. Escala de forma continua con el ancho de
ventana, sin saltos en los puntos de ruptura.

El titular del hero lleva **escala propia** (`clamp(2.25rem, 1.5rem + 3.2vw, 3.6rem)`): la
escala general está pensada para titulares a ancho completo, y en media columna rompía en
cuatro líneas.

## Espacio y forma

`--space-xs` a `--space-xl`, los dos últimos fluidos. Radios de `--radius-s` (0,5 rem) a
`--radius-pill`. Ancho de contenido `--wrap` = 71,25 rem, con `--gutter` fluido.

`--tap: 44px` es el área pulsable mínima. Toda superficie interactiva la respeta, y
`tests/responsive.spec.ts` lo comprueba a 390 px.

## Movimiento

Ocho efectos ligados al scroll:

| # | Efecto | Dónde |
| --- | --- | --- |
| 1 | Parallax: foto, mancha y badge a velocidades distintas | Hero |
| 2 | Cabecera que se compacta y gana fondo translúcido | Global |
| 3 | Contadores que animan al entrar en pantalla | Barra de confianza |
| 4 | Columna de texto fija mientras desfilan tres fotografías | El método |
| 5 | Banda que crece del 62 % al ancho completo y pierde el redondeo | Banda |
| 6 | Aparición en cascada | Servicios y el resto |
| 7 | Tarjetas que se apilan una sobre otra | Testimonios |
| 8 | El fondo vira a morado progresivamente | CTA final |

Más la barra de progreso de lectura.

### Reduced motion no es opcional

El estudio atiende a tercera edad, embarazo y rehabilitación. `prefers-reduced-motion: reduce`
desactiva los ocho efectos decorativos y deja la página quieta y completamente usable.

Siguen activos la cabecera compacta, el botón de WhatsApp y la barra de progreso: son
funcionales, no decorativos.

**El respaldo vive en CSS, no solo en JavaScript.** `.rv` recupera `opacity: 1` dentro de la
media query, así que la página se lee aunque el script nunca llegue a ejecutarse.
`tests/motion.spec.ts` comprueba que ningún elemento queda invisible ni desplazado.

## Responsive

Diseñado desde el móvil. Puntos de ruptura en 32,5 / 47,5 / 51,25 / 53,75 / 56,25 rem.
Verificado a 320, 390, 768, 1280 y 1920 px.

En móvil: navegación desplegable con `<details>`, botón flotante de WhatsApp, servicios a una
columna, testimonios sin apilado y `position: sticky` desactivado.

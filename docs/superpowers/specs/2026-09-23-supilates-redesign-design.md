# Rediseño Su Pilates by Flor — documento de diseño

**Fecha:** 2026-09-23
**Estado:** aprobado en brainstorming, pendiente de plan de implementación
**Repositorio:** `supilates-redesign`

---

## 1. Propósito

Construir una réplica estática y rediseñada de [supilatesbyflor.com](https://supilatesbyflor.com/)
que sirva como **propuesta comercial**: algo que enseñar a la propietaria del estudio para
ofrecerle un rediseño de pago.

El artefacto tiene que conseguir dos cosas a la vez:

1. **Que reconozca su web.** Mismo contenido, mismas secciones, mismas funcionalidades,
   mismo logo, misma voz. Si no se reconoce, la comparación no funciona.
2. **Que note la diferencia sin que se la expliquen.** Más rápida, más cuidada, usable en
   el móvil, con los problemas concretos de su web actual resueltos.

No es un proyecto de cliente todavía. Es la pieza que decide si lo hay.

### Criterios de éxito

- Paridad funcional completa con la web actual: ninguna capacidad se pierde.
- Lighthouse ≥ 95 en las cuatro categorías, perfil móvil.
- Navegable y legible de 320 px a 2560 px, diseñada desde el móvil hacia arriba.
- La documentación permite a otra persona entender las decisiones y continuar el trabajo.
- Cada problema detectado en la web actual queda registrado con su corrección.

---

## 2. Auditoría de la web actual

Base del argumentario comercial. Recogida el 2026-09-23 sobre el HTML servido en producción.

### Plataforma

WordPress con el tema **Divi**. La home entrega **151 KB de HTML**, `/nosotros/` **192 KB**
y `/blog/` **207 KB**, antes de CSS, JS, fuentes e imágenes. Es el peso característico de
un constructor visual que serializa cada ajuste del editor en el marcado.

### Defectos de contenido

| # | Hallazgo | Dónde |
|---|---|---|
| 1 | `<title>` con falta de ortografía: **"Pilates en Alcaá de Henares"** | `/` |
| 2 | Único post del blog: **"Hello world! — Welcome to WordPress"**, el de ejemplo sin borrar | `/blog/` |
| 3 | Texto de relleno **"Mensaje de éxito"** visible en el pie | todas |
| 4 | Enlaces de Facebook y YouTube sin URL de destino | pie |
| 5 | Widget de reseñas sin filtrar: muestra **dos valoraciones de 1 estrella** muy extensas | `/nosotros/` |

### Defectos técnicos

| # | Hallazgo | Consecuencia |
|---|---|---|
| 6 | Teléfono y email en texto plano, sin `tel:` ni `mailto:` | En el móvil no se puede pulsar para llamar |
| 7 | Etiquetas `<h6>Phone</h6>` en inglés | Web en español con rótulos sin traducir |
| 8 | `viewport` con `maximum-scale=1.0, user-scalable=0` | **Bloquea el zoom.** Incumple WCAG 2.1 AA (1.4.4) |
| 9 | Cero etiquetas Open Graph | Al compartir por WhatsApp sale sin imagen ni título |
| 10 | Sin datos estructurados `LocalBusiness` | Google no dispone de horarios ni dirección en formato legible |
| 11 | Sin aviso legal, privacidad ni política de cookies | Con formulario de email recogiendo datos, incumple el RGPD |
| 12 | Imágenes de resolución insuficiente | Ver tabla siguiente |

**El punto 9 merece énfasis:** su canal de captación es WhatsApp — todos los CTA apuntan a
`wa.link/4oru75`. Cada enlace que una alumna comparte por WhatsApp sale como una URL desnuda.

### Biblioteca de imágenes

| Archivo | Resolución | Uso |
|---|---|---|
| `Supilatesbyflorbanner.jpg` | **800 × 533** | Banner principal |
| `Pilates-400-x-400{,-2,-3}.jpg` | **400 × 400** | Bloques del método |
| `Pilates-600x792-1.jpg` | **600 × 792** | Hero |
| `Pilates-rectangular.jpg` | 1000 × 1411 | Secundaria |
| `yoga-instrcutor_84.jpg` | 400 × 381 | Nombre de banco de imágenes, con falta de ortografía |

Ninguna supera los 1000 px. Un banner a ancho completo en pantalla retina necesita ~2300 px.
No hay reprocesado posible: la información no está en el archivo.

### Lo que la web actual hace bien

- La voz de los textos es cercana y suya. **Se conserva tal cual.**
- El logo tiene carácter y es reconocible. **Se conserva.**
- 89 reseñas en Google con valoración alta: su mejor activo comercial, hoy **sin usar** en la home.

---

## 3. Alcance

### Dentro

Paridad funcional 1:1 con las mismas rutas:

| Ruta | Contenido |
|---|---|
| `/` | Hero, barra de confianza, el método + vídeo, 7 servicios, horarios, testimonios, CTA final |
| `/nosotros` | Beneficios del pilates máquina, testimonios, FAQ en acordeón |
| `/blog` | Listado de entradas |
| `/blog/[slug]` | Entrada individual |

Funcionalidades replicadas: CTA a WhatsApp, vídeo, acordeón de FAQ, rejilla de servicios,
horarios, testimonios, formulario de newsletter, enlaces sociales, pie con NAP completo.

### Añadidos, con su justificación

| Añadido | Por qué |
|---|---|
| `/404` | Hoy no existe |
| `/aviso-legal`, `/privacidad`, `/cookies` | Obligatorio en España al recoger emails (punto 11). Páginas reales, redactadas como plantilla, marcadas para revisión jurídica |
| Barra de confianza con las 89 reseñas | Su mejor activo, hoy enterrado en `/nosotros` |
| Teléfono pulsable en la cabecera | Corrige el punto 6 |
| Botón flotante de WhatsApp en móvil | Su canal principal, siempre accesible |
| Datos estructurados `LocalBusiness` | Corrige el punto 10 |

### Fuera

- Reservas online reales (hoy tampoco las tiene: todo va a WhatsApp)
- Backend de newsletter — el campo valida y responde "próximamente"
- CMS, multiidioma, zona de alumnas
- Contenido real del blog: se entregan 3 entradas de ejemplo

### Decisiones de contenido

- **Textos:** literales de su web. Sólo se corrigen los puntos 1 y 3.
- **Testimonios:** únicamente los positivos. Es una demo comercial; amplificar sus críticas
  sería contraproducente. Las negativas quedan registradas en la auditoría como argumento
  para configurar mejor el widget, no como contenido a replicar.
- **Blog:** el "Hello world!" no se replica.
- **Imágenes:** ver sección 8.

---

## 4. Arquitectura técnica

### Decisiones y alternativas descartadas

| Decisión | Alternativas descartadas |
|---|---|
| **Astro 5** con salida estática | Next.js `output: export` mete React y ~90 KB de runtime en un sitio que no necesita JS — contradice el propio argumento. HTML plano no da componentes ni colecciones y habría que reescribirlo si el proyecto avanza |
| **Sin framework de UI**, componentes `.astro` | React/Vue no aportan nada: no hay estado compartido ni vistas dinámicas |
| **CSS propio con tokens**, estilos con ámbito por componente | Tailwind acelera la escritura pero el CSS entregado es menos legible como muestra de artesanía, y aquí el entregable *es* la muestra |
| **Fuentes autoalojadas** (`@fontsource-variable`) | Google Fonts añade una conexión externa y transmite la IP del visitante a un tercero, lo que ha generado sentencias por RGPD en la UE |
| **SVG en línea** para iconos | Su web carga FontAwesome y ETmodules enteros para unos pocos glifos |
| **GitHub Pages** vía GitHub Actions | Netlify y Vercel son equivalentes; Pages es coherente con que el código ya vive en GitHub |

### Estructura

```
supilates-redesign/
├── docs/
│   ├── ARCHITECTURE.md          # estructura y decisiones
│   ├── CONTENT.md               # mapa origen → destino de cada texto e imagen
│   ├── AUDIT.md                 # la sección 2 de este documento, como entregable
│   ├── DESIGN-SYSTEM.md         # tokens, tipografía, escala, movimiento
│   └── superpowers/specs/       # este documento
├── src/
│   ├── components/
│   │   ├── layout/              # Header, Footer, Nav, WhatsAppFab, SkipLink
│   │   ├── sections/            # Hero, TrustBar, Metodo, Servicios, Horarios,
│   │   │                        # Testimonios, Faq, CtaFinal, Newsletter
│   │   └── ui/                  # Button, Card, Accordion, RatingBadge,
│   │                            # SectionHeading, Reveal
│   ├── layouts/                 # BaseLayout, PostLayout
│   ├── content/
│   │   ├── config.ts            # esquemas Zod
│   │   ├── servicios/           # 7 archivos .md
│   │   ├── testimonios/
│   │   ├── faq/
│   │   └── blog/
│   ├── data/site.ts             # NAP, horarios, redes, WhatsApp
│   ├── styles/
│   │   ├── tokens.css           # custom properties
│   │   ├── reset.css
│   │   └── global.css
│   ├── assets/images/           # optimizadas en build por astro:assets
│   └── pages/
├── public/                      # favicons, robots.txt, vídeo
├── tests/                       # Playwright
└── .github/workflows/deploy.yml
```

### Las tres decisiones estructurales

**El contenido vive fuera del código.** Servicios, testimonios, FAQ y entradas del blog son
archivos Markdown. Añadir un servicio es crear un archivo. Es también lo que permite conectar
un CMS sin tocar componentes si el proyecto sale adelante.

**`src/data/site.ts` es la única fuente de verdad** para teléfono, email, dirección, horarios
y enlace de WhatsApp. De ahí salen la cabecera, el pie, los `tel:`/`mailto:` y el JSON-LD.
Hoy en su WordPress ese dato está repetido en varias plantillas, que es cómo se desincroniza.

**Los esquemas Zod hacen fallar la compilación** ante un servicio sin icono o una entrada sin
fecha. Es exactamente la red que su WordPress no tiene: por eso lleva "Hello world!" publicado.

### Límites entre unidades

Cada componente de `sections/` recibe sus datos por props y no lee colecciones por su cuenta:
las páginas consultan el contenido y lo inyectan. Así las secciones se pueden montar en
cualquier página y probar de forma aislada. Los componentes de `ui/` no conocen el dominio —
`Card` no sabe qué es un servicio.

---

## 5. Sistema de diseño

Dirección aprobada: **editorial cálido**. Mantiene la identidad reconocible bajando el
volumen, en vez de competir con ella. El morado del logo (`#82008C`) y el verde (`#32D232`)
son muy saturados; usados a pantalla completa pelean con la fotografía.

### Tokens

```
--bone   #F7F3EE   fondo principal (hueso, no blanco puro)
--surf   #FFFFFF   superficies elevadas
--ink    #3F1C4A   titulares
--body   #5C4A62   texto corrido
--mor    #7D1F8F   morado de marca, acción principal
--mor-d  #3F1C4A   morado profundo, fondos oscuros
--verde  #2E7D32   verde de marca rebajado, CTA de WhatsApp
--lila   #F0E8F2   fondo de sección
--line   #E7DCEA   bordes
```

El verde baja de `#32D232` a `#2E7D32` porque el original no alcanza 4.5:1 sobre blanco con
texto encima. Todas las parejas texto/fondo se verifican a AA antes de darse por buenas.

### Tipografía

- **Fraunces** (serif variable) para titulares. Cursiva en los acentos.
- **Figtree** (sans variable) para texto, interfaz y rótulos.
- Tamaños con `clamp()`: escalan de forma continua, sin saltos en los puntos de ruptura.

Sustituyen a Domine + Open Sans, que son los valores por defecto de Divi y no dicen nada.

### Movimiento

Ocho efectos ligados al scroll, validados en el mockup:

1. Parallax en el hero: foto, mancha de fondo y badge a velocidades distintas
2. Cabecera que se compacta y gana fondo translúcido
3. Contadores que animan al entrar en pantalla
4. "El método": columna de texto fija mientras desfilan tres fotografías desalineadas
5. Banda fotográfica que crece del 62 % al ancho completo y pierde el redondeo
6. Las 7 tarjetas de servicio aparecen en cascada
7. Testimonios que se apilan uno sobre otro
8. Viraje progresivo del fondo a morado al llegar al CTA final

Implementado con CSS y aproximadamente 50 líneas de JavaScript: `IntersectionObserver` para
las apariciones y un único manejador de scroll con `requestAnimationFrame`. Sin librerías
de animación.

**`prefers-reduced-motion: reduce` desactiva los ocho** y deja la página quieta y completamente
usable. No es un detalle opcional: el estudio atiende a tercera edad, embarazo y rehabilitación.

### Responsive

Diseñado desde el móvil. Puntos de ruptura en 520, 760, 860 y 1140 px. Verificado a 320, 390,
768, 1280 y 1920 px.

En móvil: navegación desplegable, botón flotante de WhatsApp, rejilla de servicios a una o dos
columnas, testimonios sin apilado, `.stick` desactivado. Áreas pulsables de 44 px como mínimo.

---

## 6. Accesibilidad

Objetivo **WCAG 2.1 nivel AA**.

- `viewport` sin `maximum-scale` ni `user-scalable` — corrige el punto 8
- Contraste AA verificado en cada pareja de tokens
- Enlace de salto al contenido; recorrido completo por teclado con foco visible
- Jerarquía de encabezados correcta, un solo `<h1>` por página
- Acordeón de FAQ con `<details>`/`<summary>` nativos: accesible sin JavaScript
- Texto alternativo descriptivo en todas las imágenes; las decorativas con `alt=""`
- `prefers-reduced-motion` respetado
- Vídeo sin reproducción automática: carátula primero, MP4 al pulsar

---

## 7. SEO y rendimiento

### SEO

- `<title>` y `description` por página. Corrige el punto 1
- Open Graph y Twitter Card con imagen. Corrige el punto 9
- JSON-LD `LocalBusiness` con NAP, `openingHoursSpecification` y geo.
  **Sin `aggregateRating`:** su web publica "EXCELENTE" y "89 reseñas", pero ninguna nota
  numérica. Declarar una cifra inventada a Google en nombre de un negocio real no es una
  opción. Se incluye sólo si ella confirma el valor de su ficha de Google Business
- `sitemap.xml` vía `@astrojs/sitemap`, `robots.txt`, `canonical`
- `<html lang="es">`, rótulos en español — corrige el punto 7

**El despliegue de demostración lleva `noindex, nofollow`** y `Disallow: /` en `robots.txt`.
Replica sus textos: indexarlo crearía contenido duplicado que competiría con su web real en
Google. Se retira sólo si se convierte en la web de producción.

### Presupuesto de rendimiento

| Métrica | Objetivo | Actual |
|---|---|---|
| Lighthouse (4 categorías, móvil) | ≥ 95 | — |
| HTML de la home comprimido | ≤ 25 KB | 151 KB sin comprimir |
| JavaScript total comprimido | ≤ 15 KB | — |
| LCP en 4G simulado | < 2,0 s | — |
| CLS | < 0,05 | — |

Las casillas "actual" se rellenan midiendo su web con las mismas condiciones, para que la
comparación del documento sea honesta y no una afirmación de vendedor.

Medios: `astro:assets` genera AVIF y WebP con `srcset`, dimensiones explícitas para evitar
reflujo, carga diferida salvo el hero. El vídeo se sirve desde `public/` con `preload="none"`.

---

## 8. Imágenes y licencias

Sus originales no dan la resolución necesaria (punto 12). La demo usa fotografía de
**Unsplash** — licencia libre, uso comercial permitido, sin atribución obligatoria — elegida
para encajar con la paleta cálida de la dirección aprobada.

**El logo es suyo y no se sustituye.** Los textos son suyos.

`docs/CONTENT.md` registra cada imagen con su origen y licencia, para que nadie confunda
después qué es del estudio y qué no. Al presentar la propuesta hay tres salidas:

1. **Sesión de fotos** en el estudio — la correcta, y una partida facturable aparte
2. **Mantener el stock** — barato y funciona, pero quien conozca el local nota que no es su sitio
3. **Reprocesar las suyas** — inviable, 400 px no se recuperan

El logo se vectoriza a SVG desde el PNG de 512 px: hoy no existe versión vectorial, que es
por lo que se ve blando en pantallas grandes.

---

## 9. Verificación

Un sitio estático de marketing no se beneficia de pruebas unitarias extensas. La verificación
se concentra donde puede romperse de verdad:

| Capa | Herramienta | Qué garantiza |
|---|---|---|
| Contenido | Zod en `content/config.ts` | La compilación falla ante contenido malformado |
| Tipos | `astro check` | Sin errores de tipo |
| Rutas | Playwright | Las 8 rutas responden 200, con su `<h1>` y su `<title>`; la 404 responde 404 |
| Accesibilidad | `@axe-core/playwright` | Cero incidencias críticas en cada ruta |
| Rendimiento | Lighthouse CI | Se cumple el presupuesto de la sección 7 |
| Responsive | Lista manual | 320, 390, 768, 1280, 1920 px |

Las pruebas de rutas y accesibilidad se escriben **antes** que los componentes: definen qué
debe existir en cada página. Todo se ejecuta en CI y bloquea el despliegue.

---

## 10. Despliegue

GitHub Actions compila y publica en GitHub Pages en cada push a `main`. Las ramas de trabajo
sólo ejecutan compilación y pruebas.

- Rama de desarrollo: `feat/initial-build`
- `main` queda como rama de publicación
- `.superpowers/` y `node_modules/` en `.gitignore`

---

## 11. Documentación

Entregable por derecho propio: parte de lo que se vende es que el trabajo esté documentado.

| Archivo | Contenido |
|---|---|
| `README.md` | Qué es, cómo se arranca, cómo se despliega |
| `docs/ARCHITECTURE.md` | Estructura, límites entre unidades, por qué cada decisión |
| `docs/CONTENT.md` | Mapa origen → destino de textos e imágenes, con licencias |
| `docs/AUDIT.md` | La sección 2, como documento presentable a la clienta |
| `docs/DESIGN-SYSTEM.md` | Tokens, tipografía, escala, movimiento, reglas de accesibilidad |
| `docs/adr/` | Un registro por decisión estructural |

---

## 12. Riesgos y supuestos

| # | Asunto | Tratamiento |
|---|---|---|
| 1 | Teléfono, email y dirección tomados de su web, sin confirmar con ella | Aislados en `site.ts`: corregirlos es editar una línea |
| 2 | `wa.link/4oru75` es un acortador de terceros que puede caducar | En `site.ts`; verificar antes de presentar |
| 3 | No se dispone de la URL de su ficha de Google Business | El badge y la barra de confianza enlazan a los testimonios de la propia web. El enlace externo a Google queda pendiente de confirmar con ella |
| 4 | Reutilización de sus textos e imágenes | Demo no indexada, no publicada como negocio, identificada como propuesta. Ver la nota `noindex` de la sección 7 |
| 5 | Las páginas legales son plantillas | Marcadas como pendientes de revisión jurídica. No se presentan como asesoramiento legal |
| 6 | Las 89 reseñas salen de su web; **la nota numérica no está publicada en ningún sitio** | La interfaz muestra "Excelente · 89 reseñas en Google", que es lo que ella publica. Nada de cifras inventadas. Pendiente de confirmar con su ficha de Google Business |
| 7 | La fotografía no es de su estudio | Declarado abiertamente en la propuesta. Ver sección 8 |

---

## 13. Qué decide este documento

Astro 5 estático, sin framework de UI, CSS propio con tokens, contenido en Markdown validado
con Zod, fuentes autoalojadas, despliegue en GitHub Pages con `noindex`. Dirección visual
editorial cálida sobre el morado de su marca, con ocho efectos de scroll que se desactivan
ante `prefers-reduced-motion`. Paridad funcional completa más 404, tres páginas legales, datos
estructurados y los contactos pulsables que hoy no lo son.

Lo que no decide: el orden de construcción. Eso es el plan de implementación.

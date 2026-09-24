# Mapa de contenido

Qué procede de la web original, qué es contenido de muestra y qué licencia tiene cada
imagen. Sirve para que nadie confunda después lo que es del estudio y lo que no.

---

## Textos

| Destino | Origen | Cambios |
| --- | --- | --- |
| Titular de portada | `supilatesbyflor.com` — "Fortalece tu Cuerpo, Mente y Espíritu" | Ninguno |
| Entradilla del hero | Home original, párrafo sobre las clases de 55 min | Condensado, sin cambiar el sentido |
| Sección "El método" | Home original, párrafo del pilates con máquina | Literal |
| 7 servicios | Home original, rejilla de iconos | Títulos literales; los resúmenes se redactan a partir de sus propios textos |
| Horarios | Home original y pie | Literal |
| 4 testimonios | Home y `/nosotros` | Literales. **Solo los positivos** |
| 6 preguntas frecuentes | `/nosotros`, acordeón | Literales, corrigiendo los typos del original ("cuerponpara" → "cuerpo para", "ocurrír" → "ocurrir") |
| Beneficios del pilates | `/nosotros`, texto largo | Literal, reorganizado en siete bloques |
| CTA final | Home original — "Bien, llegó el momento!" | Literal |
| Título de la pestaña | Home original | **Corregido:** "Alcaá" → "Alcalá de Henares" |
| Pie | Home original | **Eliminado** el placeholder "Mensaje de éxito"; rótulos traducidos al español |
| 3 artículos del blog | — | **Contenido de muestra.** Escritos para la propuesta, no son suyos |
| 3 páginas legales | — | **Plantilla.** Marcadas en pantalla como pendientes de revisión jurídica |

### Datos de contacto

Todos en `src/data/site.ts`. **Tomados de su web y sin confirmar con ella.** Verificar antes
de presentar:

- Teléfono `+34 611789488`
- Email `info@supilatesbyflor.com`
- Dirección: Avenida Caballería Española 14, 28805 Alcalá de Henares
- Horarios: Lun–Vie 8:00–21:00, Sáb 10:00–13:00
- WhatsApp `https://wa.link/4oru75` — es un acortador de terceros y **puede caducar**
- 89 reseñas en Google con valoración "Excelente" — **sin nota numérica publicada**

---

## Imágenes

### Suyas

| Archivo | Origen | Uso |
| --- | --- | --- |
| `src/assets/logo.png` | `supilatesbyflor.com/wp-content/uploads/2026/03/Pilates-Logo-sin-fondo-300x300-1.png` (512 × 512) | Cabecera, pie, favicon |

**El logo es propiedad del estudio.** No se rediseña ni se sustituye: es lo que hace que
reconozca su web al abrirla.

Una versión vectorial (SVG) sería mejor para tamaños grandes, rótulos e impresión. El PNG de
512 px basta para los 44–52 px a los que aparece aquí. Vectorizarlo es una mejora que
ofrecer aparte.

### De banco de imágenes

Todas de **Unsplash**, bajo la [Licencia Unsplash](https://unsplash.com/license): uso
comercial permitido, sin atribución obligatoria.

| Archivo | Identificador Unsplash | Uso |
| --- | --- | --- |
| `hero-reformer.jpg` | `photo-1747238415033-b74eec07eb59` | Portada, imagen principal |
| `metodo-plancha.jpg` | `photo-1747240549807-fc3962949818` | El método, 1.ª |
| `metodo-madera.jpg` | `photo-1717500252573-d31d4bf5ddf1` | El método, 2.ª |
| `metodo-estiramiento.jpg` | `photo-1717500251716-27057c48ace4` | El método, 3.ª |
| `banda-estudio.jpg` | `photo-1747240031720-dced770be260` | Banda a ancho completo y `og.jpg` |
| `hero-movil.jpg` | `photo-1747239202356-764770773c9a` | Reserva |

**Estas fotografías no son del estudio de Flor.** No son sus máquinas, ni su local, ni sus
alumnas. Se eligieron por encajar con la paleta cálida de la propuesta.

Sus fotografías actuales no se pueden usar a estos tamaños: ninguna supera los 1000 px (ver
`AUDIT.md`, defecto 12). Hay tres salidas al presentarlo:

1. **Sesión de fotos en el estudio** — la correcta, y una partida facturable aparte
2. **Mantener el banco de imágenes** — barato y funciona, pero quien conozca el local lo nota
3. **Reprocesar las suyas** — inviable, 400 px no se recuperan

Decirlo antes de que lo pregunte. Si lo descubre ella, se pierde credibilidad en todo lo demás.

---

## Lo que deliberadamente no se replica

| Elemento del original | Por qué |
| --- | --- |
| Las dos reseñas de una estrella de `/nosotros` | Es una demo comercial. Amplificar sus críticas sería contraproducente. Queda registrado en `AUDIT.md` como ajuste de configuración del widget |
| El artículo "Hello world! — Welcome to WordPress" | Es el contenido de ejemplo de WordPress sin borrar |
| "Mensaje de éxito" en el pie | Texto de relleno |
| Enlaces de Facebook y YouTube | No tienen destino en el original |
| El typo "Alcaá de Henares" | Error tipográfico en el título principal |

---

## Indexación

El despliegue de demostración sirve `noindex, nofollow` en todas las páginas y `Disallow: /`
en `robots.txt`.

**Es deliberado y no debe retirarse.** La propuesta replica los textos de un negocio real:
si Google la indexa, se crea contenido duplicado que compite con su propia web en los
resultados. Solo se retira si esto pasa a ser la web de producción.

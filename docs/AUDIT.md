# Auditoría de supilatesbyflor.com

**Fecha:** 24 de septiembre de 2026
**Método:** análisis del HTML servido en producción y de los archivos de imagen publicados.

Este documento recoge lo que encontramos al revisar la web actual del estudio, con el dato
que lo respalda y la corrección aplicada en la propuesta. Es un documento presentable: no
hay opiniones sobre el diseño, solo hechos comprobables.

---

## Resumen

La web funciona y los textos son buenos. El problema es que **deja pasar clientas que ya
habían encontrado el estudio**: quien la comparte por WhatsApp envía un enlace sin vista
previa, y quien la abre en el móvil no puede pulsar el teléfono para llamar.

Se detectaron **doce defectos**, todos corregidos en la propuesta.

---

## Plataforma

WordPress con el tema **Divi**, un constructor visual que serializa en el marcado cada
ajuste del editor.

| Página | HTML servido |
| --- | --- |
| Inicio | 151 032 bytes |
| Nosotros | 192 113 bytes |
| Blog | 206 764 bytes |

Esas cifras son solo el HTML, antes de hojas de estilo, JavaScript, tipografías e imágenes.

---

## Defectos de contenido

| # | Hallazgo | Dónde | Corrección |
| --- | --- | --- | --- |
| 1 | Falta de ortografía en el título de la pestaña y en el resultado de Google: **"Pilates en Alcaá de Henares"** | Inicio | Título corregido y reescrito para incluir el servicio y la ciudad |
| 2 | Único artículo del blog: **"Hello world! — Welcome to WordPress"**, el de ejemplo que WordPress crea al instalarse | Blog | No se replica. Tres artículos de muestra sobre pilates en su lugar |
| 3 | Texto de relleno **"Mensaje de éxito"** visible en el pie de todas las páginas | Todas | Eliminado |
| 4 | Los enlaces de Facebook y YouTube del pie no llevan a ninguna parte | Pie | Solo se enlaza Instagram, que sí tiene perfil activo |
| 5 | El widget de reseñas muestra **todas** las valoraciones sin filtrar, incluidas dos de una estrella muy extensas | Nosotros | Es una opción de configuración del widget, que permite mostrar solo a partir de cuatro estrellas |

---

## Defectos técnicos

| # | Hallazgo | Consecuencia | Corrección |
| --- | --- | --- | --- |
| 6 | Teléfono y email escritos como texto plano, sin enlace `tel:` ni `mailto:` | En el móvil no se puede pulsar para llamar ni escribir | Ambos son enlaces pulsables, con área táctil de 44 px |
| 7 | Rótulos del pie en inglés: `<h6>Phone</h6>` | Web en español con etiquetas sin traducir | Todos los rótulos en español |
| 8 | La etiqueta `viewport` incluye `maximum-scale=1.0, user-scalable=0` | **Bloquea el zoom del navegador.** Incumple el criterio WCAG 2.1 AA 1.4.4 | Zoom permitido |
| 9 | Ninguna etiqueta Open Graph en todo el sitio | Al compartir un enlace por WhatsApp aparece la URL desnuda, sin imagen ni título | Open Graph y Twitter Card completos, con imagen de 1200 × 630 |
| 10 | Sin datos estructurados de negocio local | Google no dispone de horarios ni dirección en formato legible | JSON-LD `HealthAndBeautyBusiness` con dirección, teléfono y horarios |
| 11 | No hay aviso legal, política de privacidad ni política de cookies | El pie recoge direcciones de correo mediante un formulario. Incumple el RGPD | Tres páginas publicadas, marcadas como plantilla pendiente de revisión jurídica |
| 12 | Imágenes de resolución insuficiente | Se ven borrosas en pantallas modernas | Ver tabla siguiente |

**El punto 9 es el más costoso.** Todos los botones de la web llevan al mismo enlace de
WhatsApp: es el canal de captación del estudio. Cada enlace compartido en ese canal se ve
peor de lo que debería.

---

## Biblioteca de imágenes

| Archivo | Resolución | Uso en la web |
| --- | --- | --- |
| `Supilatesbyflorbanner.jpg` | **800 × 533** | Banner principal |
| `Pilates-400-x-400.jpg` | **400 × 400** | Bloque del método |
| `Pilates-400-x-400-2.jpg` | **400 × 400** | Bloque del método |
| `Pilates-400-x-400-3.jpg` | **400 × 400** | Bloque del método |
| `Pilates-600x792-1.jpg` | **600 × 792** | Imagen principal |
| `Pilates-rectangular.jpg` | 1000 × 1411 | Secundaria |
| `yoga-instrcutor_84.jpg` | 400 × 381 | Secundaria |

Ninguna supera los 1000 píxeles. Una imagen a ancho completo en una pantalla de alta
densidad necesita alrededor de 2300 píxeles de ancho para verse nítida.

**No hay reprocesado posible:** la información no está en el archivo. La única solución es
fotografía nueva.

El archivo `yoga-instrcutor_84.jpg` conserva el nombre con el que se descargó de un banco de
imágenes, con la falta de ortografía incluida.

---

## Medidas comparadas

| Métrica | Web actual | Propuesta |
| --- | --- | --- |
| HTML de la portada | 151 032 bytes | 26 799 bytes (**–82 %**) |
| JavaScript | Divi, jQuery y dependencias del tema | 1 113 bytes comprimidos |
| Etiquetas Open Graph | 0 | Completas |
| Contactos pulsables | 0 | Teléfono y email |
| Páginas legales | 0 | 3 |
| Zoom del navegador | Bloqueado | Permitido |

Las cifras de Lighthouse se añadirán midiendo ambas webs en idénticas condiciones, para que
la comparación sea un dato y no una impresión.

---

## Lo que la web actual hace bien

Conviene decirlo, y no solo por cortesía: son las partes que **se conservan**.

- **Los textos.** La voz es cercana, concreta y suya. Se reutilizan literalmente, corrigiendo
  únicamente los puntos 1 y 3.
- **El logotipo.** Tiene carácter y es reconocible. No se rediseña.
- **Las 89 reseñas con valoración excelente.** Es el mejor activo comercial del estudio.
  Hoy solo aparecen en la página de Nosotros, por debajo del pliegue. En la propuesta suben
  a la portada.

---

## Nota sobre la valoración numérica

La web publica el rótulo "EXCELENTE" y el recuento de 89 reseñas, pero **ninguna nota
numérica**. La propuesta muestra exactamente eso mismo y **no incluye `aggregateRating`** en
los datos estructurados: declarar a Google una puntuación sin confirmar en nombre de un
negocio real sería falsear información.

Si se confirma la cifra real de la ficha de Google Business, se añade.

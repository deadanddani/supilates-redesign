# ADR 0001 — Astro estático en lugar de WordPress

**Fecha:** 2026-09-24 · **Estado:** aceptado

## Contexto

La web original es WordPress con el tema Divi. Su portada entrega 151 032 bytes de HTML.
La propuesta debe demostrar la mejora, no solo afirmarla.

## Decisión

Astro 7 con salida estática, sin framework de interfaz.

## Alternativas descartadas

- **WordPress con otro tema.** Mantiene el problema de fondo: actualizaciones, plugins y una
  superficie que hay que mantener para un sitio de cuatro páginas que no cambia.
- **Next.js con `output: export`.** Mete React y unos 90 KB de runtime en un sitio que no
  necesita JavaScript. Contradice el argumento que sostiene la propuesta.
- **HTML plano.** Sin componentes ni colecciones: la cabecera se duplicaría en cuatro
  archivos y cada artículo del blog sería HTML a mano. Habría que reescribirlo si el
  proyecto avanza.

## Consecuencias

El HTML de la portada baja a 26 799 bytes, un 82 % menos. El JavaScript total son 1113 bytes
comprimidos. A cambio hace falta Node y un paso de compilación, y la propietaria no puede
editar el contenido sin un CMS encima (Decap, si el proyecto avanza).

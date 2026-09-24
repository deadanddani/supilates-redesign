# ADR 0004 — Cómo se mide el presupuesto de Lighthouse

**Fecha:** 2026-09-24 · **Estado:** aceptado

## Contexto

Dos problemas aparecieron al configurar Lighthouse CI.

### El `staticDistDir` falseaba el CLS

Sirviendo `dist/` directamente desde la raíz, las rutas de los recursos
(`/supilates-redesign/_astro/…`) devuelven 404, porque el sitio se publica bajo el prefijo de
GitHub Pages. Sin imágenes, la página se recomponía al cargar y Lighthouse medía un CLS de
**0,243**.

Medido contra el servidor real de vista previa, el CLS es **0,021**.

### La categoría SEO no puede llegar a 0,95

El `noindex` deliberado (ver ADR 0003) deja la categoría SEO en 0,69 de forma permanente.
Desactivar el audit `is-crawlable` no cambia la puntuación de la categoría: Lighthouse la
calcula igual.

## Decisión

1. Lighthouse se ejecuta contra `astro preview` con las URL completas, no contra
   `staticDistDir`.
2. No se asserta la categoría SEO. En su lugar se assertan los audits concretos que sí
   importan y que el `noindex` no afecta: `document-title`, `meta-description`,
   `html-has-lang`, `link-text`, `crawlable-anchors`.

## Consecuencias

El presupuesto mide lo que se sirve de verdad. Un umbral de categoría que nunca puede
cumplirse se habría acabado desactivando entero, y con él las comprobaciones de SEO que sí
son útiles.

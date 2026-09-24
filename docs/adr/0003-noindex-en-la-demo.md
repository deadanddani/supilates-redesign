# ADR 0003 — La demostración no se indexa

**Fecha:** 2026-09-24 · **Estado:** aceptado

## Contexto

La propuesta replica literalmente los textos de supilatesbyflor.com, un negocio real en
activo, y se despliega en una URL pública.

## Decisión

Todas las páginas sirven `<meta name="robots" content="noindex, nofollow">` y `robots.txt`
contiene `Disallow: /`.

## Razón

Si Google indexa la demostración, aparecen dos sitios con los mismos textos compitiendo en
los resultados. El perjudicado sería el negocio al que se pretende vender el rediseño.

Regalarle un problema de contenido duplicado mientras se le intenta vender una mejora es la
peor forma posible de abrir la conversación.

## Consecuencias

La categoría SEO de Lighthouse penaliza el `noindex`. Se desactiva esa comprobación concreta
en `lighthouserc.json`, documentando por qué.

El `noindex` **solo se retira** si esto pasa a ser la web de producción del estudio, con su
consentimiento y sobre su dominio.

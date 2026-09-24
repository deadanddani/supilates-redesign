# ADR 0002 — CSS propio en lugar de Tailwind

**Fecha:** 2026-09-24 · **Estado:** aceptado

## Contexto

Hay que elegir cómo se escriben los estilos de un sitio de cuatro páginas cuyo propósito es
servir de muestra de trabajo.

## Decisión

CSS propio con custom properties en `src/styles/tokens.css` y estilos con ámbito por
componente `.astro`.

## Alternativas descartadas

- **Tailwind.** Se escribe más rápido, pero el marcado se llena de clases utilitarias y el
  CSS entregado deja de leerse como artesanía. Aquí el entregable *es* la muestra.
- **CSS-in-JS.** Requiere runtime. Innecesario en un sitio estático.

## Consecuencias

Los tokens son el contrato: cambiar `--mor` cambia toda la marca desde un punto. El test de
contraste lee esos tokens y falla si alguien baja una pareja por debajo de 4.5:1, así que la
accesibilidad del color no depende de acordarse.

A cambio, escribir cada sección lleva más tiempo que con utilidades.

/*
 * Efectos de scroll sin escuchar el evento scroll.
 *
 * - Apariciones y contadores: IntersectionObserver.
 * - Cabecera compacta y boton de WhatsApp: dos centinelas invisibles
 *   observados con IntersectionObserver (sin calcular window.scrollY en
 *   cada fotograma).
 * - Parallax del hero, la banda que se abre y la barra de progreso viven
 *   en CSS con animation-timeline; donde no hay soporte, se quedan quietos.
 *
 * prefers-reduced-motion desactiva los efectos decorativos. La cabecera
 * compacta y el boton de WhatsApp siguen activos: son funcionales.
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* apariciones en cascada ------------------------------------------------ */
const reveals = document.querySelectorAll<HTMLElement>('.rv');

if (reduce) {
  reveals.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  reveals.forEach((el) => io.observe(el));
}

/* contadores ------------------------------------------------------------- */
document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
  const destino = Number(el.dataset.count);
  if (!Number.isFinite(destino)) return;

  if (reduce) {
    el.textContent = String(destino);
    return;
  }

  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        obs.unobserve(e.target);
        const inicio = performance.now();
        const paso = (t: number) => {
          const p = Math.min((t - inicio) / 1100, 1);
          el.textContent = String(Math.round(destino * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
      }
    },
    { threshold: 0.6 },
  );
  obs.observe(el);
});

/* cabecera compacta y boton flotante ------------------------------------ */
function alPasar(id: string, alCambiar: (pasado: boolean) => void): void {
  const centinela = document.getElementById(id);
  if (!centinela) return;
  new IntersectionObserver(([e]) => {
    /* "pasado" = el centinela ha salido por arriba, no por abajo */
    alCambiar(!e.isIntersecting && e.boundingClientRect.top < 0);
  }).observe(centinela);
}

const cabecera = document.getElementById('cabecera');
const fab = document.getElementById('fab');

alPasar('centinela-cabecera', (pasado) => cabecera?.classList.toggle('shrunk', pasado));
alPasar('centinela-fab', (pasado) => fab?.classList.toggle('on', pasado));

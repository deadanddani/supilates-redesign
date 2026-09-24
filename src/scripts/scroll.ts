/*
 * Los ocho efectos de scroll de la home.
 *
 * Sin librerias de animacion: IntersectionObserver para las apariciones y
 * los contadores, y un unico manejador de scroll pasivo con
 * requestAnimationFrame para lo que depende de la posicion.
 *
 * prefers-reduced-motion desactiva los efectos decorativos. La cabecera
 * compacta, el boton de WhatsApp y la barra de progreso siguen activos:
 * son funcionales, no decorativos.
 */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 6 · apariciones en cascada ------------------------------------------- */
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

/* 3 · contadores -------------------------------------------------------- */
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

/* 1, 2, 5, 8 · ligados a la posicion del scroll ------------------------- */
const cabecera = document.getElementById('cabecera');
const fab = document.getElementById('fab');
const progreso = document.getElementById('progreso');
const heroImg = document.getElementById('hero-img');
const mancha = document.getElementById('mancha');
const badge = document.querySelector<HTMLElement>('.badge');
const banda = document.getElementById('banda');
const tinte = document.getElementById('tinte');
const cta = document.getElementById('cta');

let encolado = false;

function alHacerScroll(): void {
  const y = window.scrollY;
  const vh = window.innerHeight;

  /* Funcionales: siguen activos con reduced-motion. */
  cabecera?.classList.toggle('shrunk', y > 40);
  fab?.classList.toggle('on', y > vh * 0.55);

  if (progreso) {
    const recorrido = document.body.scrollHeight - vh;
    progreso.style.transform = `scaleX(${recorrido > 0 ? y / recorrido : 0})`;
  }

  if (reduce) return;

  /* 1 · parallax del hero: foto, mancha y badge a velocidades distintas */
  const p = Math.min(y / vh, 1);
  if (heroImg) heroImg.style.transform = `translateY(${p * -8}%) scale(${1 + p * 0.07})`;
  if (mancha) mancha.style.transform = `translate3d(0, ${p * 90}px, 0)`;
  if (badge) badge.style.transform = `translateY(${p * -34}px)`;

  /* 5 · la banda crece del 62% al ancho completo y pierde el redondeo */
  if (banda) {
    const r = banda.getBoundingClientRect();
    const q = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.85)));
    banda.style.width = `${62 + 38 * q}%`;
    banda.style.borderRadius = `${1.375 - 1.375 * q}rem`;
  }

  /* 8 · el fondo vira a morado al acercarse al CTA final */
  if (tinte && cta) {
    const r = cta.getBoundingClientRect();
    const q = Math.max(0, Math.min(1, (vh - r.top) / (vh * 0.72)));
    tinte.style.opacity = String(q);
    cta.classList.toggle('lit', q > 0.5);
  }
}

window.addEventListener(
  'scroll',
  () => {
    if (encolado) return;
    encolado = true;
    requestAnimationFrame(() => {
      alHacerScroll();
      encolado = false;
    });
  },
  { passive: true },
);

window.addEventListener('resize', alHacerScroll, { passive: true });
alHacerScroll();

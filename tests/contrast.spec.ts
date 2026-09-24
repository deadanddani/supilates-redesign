import { test, expect } from '@playwright/test';
import { R } from './rutas';

// El minificador de CSS acorta #ffffff a #fff, asi que hay que expandirlo.
function expandir(hex: string): string {
  const h = hex.trim().replace('#', '');
  const largo = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return `#${largo.toLowerCase()}`;
}

function luminancia(hex: string): number {
  const h = expandir(hex);
  const v = [1, 3, 5].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

function ratio(a: string, b: string): number {
  const [alto, bajo] = [luminancia(a), luminancia(b)].sort((p, q) => q - p);
  return (alto + 0.05) / (bajo + 0.05);
}

test('cada pareja texto/fondo cumple AA', async ({ page }) => {
  await page.goto(R.home);
  const t = await page.evaluate(() => {
    const s = getComputedStyle(document.documentElement);
    const g = (n: string) => s.getPropertyValue(n).trim();
    return {
      bone: g('--bone'), surf: g('--surf'), ink: g('--ink'),
      body: g('--body'), mor: g('--mor'), verde: g('--verde'),
      lila: g('--lila'), star: g('--star'),
    };
  });

  const parejas: Array<[string, string, string]> = [
    ['cuerpo sobre hueso', t.body, t.bone],
    ['titular sobre hueso', t.ink, t.bone],
    ['cuerpo sobre blanco', t.body, t.surf],
    ['cuerpo sobre lila', t.body, t.lila],
    ['blanco sobre morado', '#ffffff', t.mor],
    ['blanco sobre verde', '#ffffff', t.verde],
    ['estrellas sobre blanco', t.star, t.surf],
  ];

  for (const [nombre, fg, bg] of parejas) {
    expect(fg, `${nombre}: el token esta vacio`).toMatch(/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i);
    expect(ratio(fg, bg), `${nombre} (${fg} sobre ${bg})`).toBeGreaterThanOrEqual(4.5);
  }
});

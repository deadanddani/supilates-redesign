import { test, expect } from '@playwright/test';
import { R } from './rutas';

const ANCHOS = [320, 390, 768, 1280, 1920];
const RUTAS = [R.home, R.nosotros, R.blog];

for (const ruta of RUTAS) {
  for (const width of ANCHOS) {
    test(`${ruta} a ${width}px no produce scroll horizontal`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      const res = await page.goto(ruta);
      expect(res?.status()).toBe(200);
      const culpable = await page.evaluate(() => {
        const limite = document.documentElement.clientWidth;
        if (document.documentElement.scrollWidth <= limite + 1) return null;
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('body *'))) {
          const r = el.getBoundingClientRect();
          if (r.right > limite + 1 || r.left < -1) {
            return `${el.tagName.toLowerCase()}.${el.className}`.slice(0, 120);
          }
        }
        return 'desconocido';
      });
      expect(culpable, 'algo desborda el ancho de la ventana').toBeNull();
    });
  }
}

test('las areas pulsables llegan a 44px en movil', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(R.home);
  const objetivos = page.locator('a.btn, .fab, header a, footer a');
  for (const el of await objetivos.all()) {
    if (!(await el.isVisible())) continue;
    const caja = await el.boundingBox();
    if (caja) expect(caja.height, await el.innerText()).toBeGreaterThanOrEqual(44);
  }
});

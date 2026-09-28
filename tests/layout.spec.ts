import { test, expect } from '@playwright/test';
import { R, RUTAS_PUBLICAS } from './rutas';

/*
 * Las tres resoluciones de referencia del rediseño: movil, tablet y
 * escritorio. En cada una, ninguna pagina publica puede desbordar en
 * horizontal y los elementos clave tienen que estar a la vista.
 */
const TAMANOS = [
  { nombre: 'movil', width: 390, height: 844 },
  { nombre: 'tablet', width: 768, height: 1024 },
  { nombre: 'escritorio', width: 1440, height: 900 },
] as const;

for (const t of TAMANOS) {
  test.describe(`${t.nombre} ${t.width}x${t.height}`, () => {
    test.use({ viewport: { width: t.width, height: t.height } });

    for (const ruta of RUTAS_PUBLICAS) {
      test(`${ruta} no desborda en horizontal`, async ({ page }) => {
        await page.goto(ruta);
        const culpable = await page.evaluate(() => {
          const limite = document.documentElement.clientWidth;
          if (document.documentElement.scrollWidth <= limite) return null;
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

    test('la home muestra sus elementos clave', async ({ page }) => {
      await page.goto(R.home);
      await expect(page.locator('#cabecera .logo')).toBeVisible();
      await expect(page.locator('h1')).toBeInViewport();

      /* la accion principal se ve sin hacer scroll */
      const cta = page.locator('.hero .btn');
      await expect(cta).toBeInViewport();
      const caja = await cta.boundingBox();
      expect(caja!.height).toBeGreaterThanOrEqual(44);

      /* navegacion: en escritorio los enlaces, en movil y tablet el menu */
      const nav = t.width > 820 ? page.locator('nav.escritorio') : page.locator('details.movil summary');
      await expect(nav).toBeVisible();
      await expect(page.locator(`#cabecera a[href="tel:+34611789488"]`)).toBeVisible();

      for (const id of ['#metodo', '#servicios', '#horarios', '#testimonios', '#cta']) {
        await page.locator(id).scrollIntoViewIfNeeded();
        await expect(page.locator(`${id} h2`)).toBeVisible();
      }
      await expect(page.locator('footer')).toBeAttached();
    });
  });
}

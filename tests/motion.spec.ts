import { test, expect } from '@playwright/test';
import { R } from './rutas';

/*
 * El estudio atiende a tercera edad, embarazo y rehabilitacion.
 * Con las animaciones desactivadas la pagina tiene que quedar quieta
 * y COMPLETAMENTE legible: ningun elemento invisible o fuera de sitio.
 */
test.describe('con prefers-reduced-motion: reduce', () => {
  test.use({ reducedMotion: 'reduce' });

  test('ningun elemento se queda invisible ni desplazado', async ({ page }) => {
    await page.goto(R.home);
    const ocultos = await page.evaluate(() =>
      Array.from(document.querySelectorAll<HTMLElement>('.rv'))
        .filter((el) => {
          const s = getComputedStyle(el);
          const movido = s.transform !== 'none' && s.transform !== 'matrix(1, 0, 0, 1, 0, 0)';
          return Number(s.opacity) < 1 || movido;
        })
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
    );
    expect(ocultos).toEqual([]);
  });

  test('los contadores muestran su valor final', async ({ page }) => {
    await page.goto(R.home);
    await expect(page.locator('[data-count="89"]')).toHaveText('89');
    await expect(page.locator('[data-count="55"]')).toHaveText('55');
  });

  test('la banda ocupa el ancho completo sin animarse', async ({ page }) => {
    await page.goto(R.home);
    const ancho = await page.locator('#banda').evaluate((el) => getComputedStyle(el).width);
    const padre = await page.locator('#banda').evaluate((el) => getComputedStyle(el.parentElement!).width);
    expect(ancho).toBe(padre);
  });
});

test.describe('con movimiento permitido', () => {
  test('los elementos aparecen al entrar en pantalla', async ({ page }) => {
    await page.goto(R.home);
    const objetivo = page.locator('#servicios .rv').first();
    await objetivo.scrollIntoViewIfNeeded();
    await expect(objetivo).toHaveClass(/\bin\b/, { timeout: 4000 });
  });

  test('la cabecera se compacta y el boton de WhatsApp aparece al bajar', async ({ page }) => {
    await page.goto(R.home);
    await expect(page.locator('#cabecera')).not.toHaveClass(/shrunk/);
    await expect(page.locator('#fab')).not.toHaveClass(/\bon\b/);
    await page.mouse.wheel(0, 1200);
    await expect(page.locator('#cabecera')).toHaveClass(/shrunk/, { timeout: 3000 });
    await expect(page.locator('#fab')).toHaveClass(/\bon\b/, { timeout: 3000 });
  });

  test('los contadores animan desde cero hasta su valor', async ({ page }) => {
    await page.goto(R.home);
    await page.locator('[data-count="89"]').scrollIntoViewIfNeeded();
    await expect(page.locator('[data-count="89"]')).toHaveText('89', { timeout: 4000 });
  });
});

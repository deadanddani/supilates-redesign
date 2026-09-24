import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { R, RUTAS_PUBLICAS } from './rutas';

/*
 * Con las animaciones activas axe muestrea el color a mitad de la
 * transicion de aparicion y reporta falsos contrastes. El estado
 * asentado es el que hay que auditar.
 */
test.use({ reducedMotion: 'reduce' });

for (const ruta of RUTAS_PUBLICAS) {
  test(`${ruta} no tiene incidencias graves de accesibilidad`, async ({ page }) => {
    const res = await page.goto(ruta);
    expect(res?.status(), `${ruta} no existe: axe estaria analizando la pagina 404`).toBe(200);
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const graves = r.violations.filter((v) => ['critical', 'serious'].includes(v.impact ?? ''));
    expect(graves.map((v) => `${v.id}: ${v.nodes[0]?.html ?? ''}`)).toEqual([]);
  });
}

test('el telefono y el email son pulsables', async ({ page }) => {
  await page.goto(R.home);
  await expect(
    page.locator('a[href="tel:+34611789488"]').first(),
    'su web lo tiene como texto plano: en movil no se puede llamar',
  ).toBeVisible();
  await expect(page.locator('a[href="mailto:info@supilatesbyflor.com"]').first()).toBeVisible();
});

test('no queda texto de relleno ni rotulos en ingles', async ({ page }) => {
  await page.goto(R.home);
  const texto = (await page.locator('body').innerText()).toLowerCase();
  expect(texto, 'el placeholder del pie original').not.toContain('mensaje de éxito');
  expect(texto, 'el rotulo Phone del pie original').not.toMatch(/\bphone\b/);
});

test('la navegacion y el contenido funcionan sin JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(R.home);
  await expect(page.locator('a[href$="/nosotros"]').first()).toBeVisible();
  await expect(page.locator('h1')).toBeVisible();
  await ctx.close();
});

test('existe un enlace de salto al contenido', async ({ page }) => {
  await page.goto(R.home);
  const skip = page.locator('a[href="#contenido"]');
  await expect(skip).toHaveCount(1);
  await skip.focus();
  await expect(skip).toBeInViewport();
});

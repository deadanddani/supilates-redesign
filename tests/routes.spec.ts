import { test, expect } from '@playwright/test';
import { R } from './rutas';

test('la home responde y tiene un unico h1', async ({ page }) => {
  const res = await page.goto(R.home);
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
});

test('/nosotros tiene FAQ que funciona sin JavaScript', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(R.nosotros);
  // Acotado a la FAQ: el menu movil tambien es un <details> y va antes en el DOM.
  const primera = page.locator('#faq details').first();
  await expect(primera).not.toHaveAttribute('open', '');
  await primera.locator('summary').click();
  await expect(primera).toHaveAttribute('open', '');
  await ctx.close();
});

test('/blog lista las entradas y no replica el Hello world', async ({ page }) => {
  const res = await page.goto(R.blog);
  expect(res?.status()).toBe(200);
  expect(await page.locator('article').count()).toBeGreaterThan(0);
  await expect(page.getByText('Hello world')).toHaveCount(0);
  await expect(page.getByText('Welcome to WordPress')).toHaveCount(0);
});

test('cada entrada del blog tiene su pagina con fecha legible por maquina', async ({ page }) => {
  await page.goto(R.blog);
  await page.locator('article a').first().click();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('time[datetime]')).toHaveCount(1);
});

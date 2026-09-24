import { test, expect } from '@playwright/test';
import { R } from './rutas';

test('la home responde y tiene un unico h1', async ({ page }) => {
  const res = await page.goto(R.home);
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
});

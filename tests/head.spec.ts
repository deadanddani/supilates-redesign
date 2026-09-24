import { test, expect } from '@playwright/test';
import { R } from './rutas';

test('el head cumple las restricciones del spec', async ({ page }) => {
  await page.goto(R.home);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

  const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
  expect(viewport, 'el viewport no debe bloquear el zoom (WCAG 1.4.4)').not.toMatch(/maximum-scale|user-scalable/);

  await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
  await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

  const title = await page.title();
  expect(title).toContain('Alcala de Henares'.replace('Alcala', 'Alcalá'));
  expect(title, 'el typo del titulo original no debe replicarse').not.toContain('Alcaá');
});

test('el JSON-LD describe el negocio sin inventar valoracion', async ({ page }) => {
  await page.goto(R.home);
  const raw = await page.locator('script[type="application/ld+json"]').innerText();
  const ld = JSON.parse(raw);
  expect(ld['@type']).toBe('HealthAndBeautyBusiness');
  expect(ld.telephone).toBe('+34611789488');
  expect(ld.address.addressLocality).toBe('Alcalá de Henares');
  expect(ld.openingHoursSpecification).toHaveLength(2);
  expect(ld.aggregateRating, 'su web no publica nota numerica: no se le declara una a Google').toBeUndefined();
});

test('no se piden fuentes a Google', async ({ page }) => {
  const externos: string[] = [];
  page.on('request', (r) => {
    if (/fonts\.(googleapis|gstatic)\.com/.test(r.url())) externos.push(r.url());
  });
  await page.goto(R.home);
  expect(externos).toEqual([]);
});

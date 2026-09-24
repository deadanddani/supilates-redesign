import { defineConfig, devices } from '@playwright/test';

const BASE = 'http://localhost:4321/supilates-redesign/';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : [['list']],
  use: { baseURL: BASE, trace: 'on-first-retry' },
  webServer: {
    command: 'npm run build && npx astro preview --port 4321 --ignore-lock',
    url: BASE,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});

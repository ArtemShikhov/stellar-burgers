import { defineConfig, devices } from '@playwright/test';

/**
 * Конфигурация Playwright для интеграционных тестов страницы конструктора.
 * Тесты запускаются против локального dev-сервера (npm start),
 * все запросы к бэкенду подменяются моками из tests/hars.
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.pl.tsx',
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },

  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});

import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/artifacts',
  timeout: 20_000,
  // Rendering the full illustrated Phaser canvas is GPU-heavy on the supported
  // macOS test host. Sequential runs make timeout results reproducible.
  workers: 1,
  expect: { timeout: 8_000 },
  reporter: [['list'], ['html', { outputFolder: 'test-results/report', open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:5173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Playwright's bundled ffmpeg is unavailable on macOS 12; traces and screenshots remain enabled.
    video: 'off',
    launchOptions: {
      executablePath: '/Applications/Brave Browser.app/Contents/MacOS/Brave Browser',
      args: ['--autoplay-policy=no-user-gesture-required'],
    },
  },
  projects: [{ name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1536, height: 1024 } } }],
  webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:5173', reuseExistingServer: true, timeout: 30_000 },
})

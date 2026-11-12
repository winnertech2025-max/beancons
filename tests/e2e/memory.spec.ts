import { expect, test } from '@playwright/test'

test('Memory Home theme and card input keep the active round stable', async ({ page }, testInfo) => {
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('MemoryHome'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }

  // Choose the actual Animals theme, then use two physical card positions.
  await point(485, 370)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('MemoryHome').some(object => object.labels?.includes('NGÔI NHÀ · ĐỘNG VẬT · LEVEL 1')))).toBe(true)
  await point(485, 390); await page.waitForTimeout(280)
  await point(1050, 390); await page.waitForTimeout(1_100)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('MemoryHome').some(object => object.labels?.includes('NGÔI NHÀ · ĐỘNG VẬT · LEVEL 1')))).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('memory-round-stable.png') })
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

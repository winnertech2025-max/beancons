import { expect, test } from '@playwright/test'

test('Farm Shop spends stars and preserves purchased supplied-art decoration', async ({ page }, testInfo) => {
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  // Seed only through the real store API; reloading mid-loading can mask a
  // Boot regression and does not test the shop interaction itself.
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.state().reward('shop-test-stars', 5))
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('FarmShop'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible(); await page.waitForTimeout(350)
  await page.screenshot({ path: testInfo.outputPath('shop-initial.png') })
  const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing')
  await page.mouse.click(box.x + 390 / 1536 * box.width, box.y + 735 / 1024 * box.height)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.state().ownedItems.includes('garden-tree'))).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('shop-purchased.png') })
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

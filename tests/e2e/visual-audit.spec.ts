import { expect, test } from '@playwright/test'

test('capture every playable entry scene for visual QA', async ({ page }, testInfo) => {
  // Scene assets intentionally stream one area at a time; visual QA needs a
  // generous ceiling on slower devices rather than a false timeout.
  test.setTimeout(180_000)
  const errors: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  for (const [scene, filename] of [
    ['Welcome', '01-welcome.png'], ['Avatar', '02-avatar.png'], ['Intro', '03-intro.png'], ['FarmMap', '04-map.png'],
    ['CropFarm', '05-crop.png'], ['CowFarm', '06-cow.png'], ['FishingLake', '07-fishing.png'], ['MemoryHome', '08-memory.png'],
    ['ChickenFarm', '09-chicken.png'], ['SheepFarm', '10-sheep.png'], ['Warehouse', '11-warehouse.png'], ['FarmShop', '12-shop.png'],
  ] as const) {
    await page.evaluate((nextScene) => window.__HAPPY_FARM_QA__?.start(nextScene), scene)
    await page.waitForTimeout(700)
    await page.screenshot({ path: testInfo.outputPath(filename) })
  }
  expect(errors).toEqual([])
})

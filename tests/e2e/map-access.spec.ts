import { expect, test } from '@playwright/test'

test('every illustrated Farm Map destination is available without completion gating', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  const errors: string[] = []
  const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => failures.push(request.url()))
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => {
    const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing')
    await page.mouse.click(box.x + x / 1536 * box.width, box.y + y / 1024 * box.height)
  }
  const zones: Array<[string, number, number, string]> = [
    ['crop', 1190, 714, 'CropFarm'], ['cow', 1124, 333, 'CowFarm'], ['chicken', 507, 515, 'ChickenFarm'],
    ['lake', 757, 465, 'FishingLake'], ['sheep', 1252, 558, 'SheepFarm'], ['home', 360, 310, 'MemoryHome'], ['warehouse', 770, 265, 'Warehouse'],
  ]
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('FarmMap'))
  await page.waitForTimeout(250)
  for (const [label, x, y, scene] of zones) {
    await point(x, y)
    await expect.poll(() => page.evaluate(() => (window.__HAPPY_FARM_QA__?.scenes() ?? []).at(-1)), { timeout: 6_000 }).toBe(scene)
    await page.screenshot({ path: testInfo.outputPath(`map-${label}.png`) })
    if (label === 'sheep') {
      for (let jump = 0; jump < 3; jump++) { await point(768, 850); await page.waitForTimeout(450) }
      await page.screenshot({ path: testInfo.outputPath('map-sheep-complete.png') })
    }
    await point(104, 70)
    await expect.poll(() => page.evaluate(() => (window.__HAPPY_FARM_QA__?.scenes() ?? []).at(-1)), { timeout: 4_000 }).toBe('FarmMap')
  }
  expect(errors).toEqual([])
  expect(failures).toEqual([])
})

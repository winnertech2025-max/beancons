import { expect, test } from '@playwright/test'

test('Farm Delivery uses supplied art through ready, preparation, truck loading, and result', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  const failures: string[] = []
  const errors: string[] = []
  page.on('requestfailed', r => failures.push(r.url()))
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('Warehouse'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  await page.waitForTimeout(600); await page.screenshot({ path: testInfo.outputPath('warehouse-ready.png') })
  await point(638, 600); await page.waitForTimeout(350); await point(1055, 745); await page.waitForTimeout(350)
  await point(260, 515); await page.waitForTimeout(350); await page.screenshot({ path: testInfo.outputPath('warehouse-prepare.png') })
  for (const [x, y] of [[475,325],[615,325],[755,325],[895,325],[475,510],[615,510],[755,510],[895,510],[1035,510]]) await point(x, y)
  await point(768, 875); await page.waitForTimeout(400); await page.screenshot({ path: testInfo.outputPath('warehouse-delivery.png') })
  const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing')
  for (let i = 0; i < 5; i++) {
    const x = 390 + i * 105
    await page.mouse.move(b.x + x / 1536 * b.width, b.y + 832 / 1024 * b.height)
    await page.mouse.down(); await page.waitForTimeout(35); await page.mouse.move(b.x + 900 / 1536 * b.width, b.y + 510 / 1024 * b.height, { steps: 8 }); await page.waitForTimeout(35); await page.mouse.up()
  }
  await page.waitForTimeout(1300); await page.screenshot({ path: testInfo.outputPath('warehouse-success.png') })
  expect(await page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('warehouse-delivery'))).toBe(true)
  await point(1000, 780); await page.waitForTimeout(250); await point(768, 760)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? [])).toContain('FarmMap')
  expect(failures).toEqual([]); expect(errors).toEqual([])
})

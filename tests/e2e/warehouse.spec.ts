import { expect, test } from '@playwright/test'

test('Warehouse portrait viewport presents the rotate instruction', async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/', { waitUntil: 'commit' })
  await expect(page.getByText('Hãy xoay ngang màn hình')).toBeVisible({ timeout: 20_000 })
  await page.screenshot({ path: testInfo.outputPath('warehouse-portrait-rotate.png') })
})

test('Farm Delivery uses supplied art through ready, preparation, truck loading, and result', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  const failures: string[] = []
  const errors: string[] = []
  page.on('requestfailed', r => { if (r.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(r.url()) })
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('Warehouse'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  const hover = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.move(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  await page.waitForTimeout(600); await page.screenshot({ path: testInfo.outputPath('warehouse-ready.png') })
  await point(638, 600); await page.waitForTimeout(350); await page.screenshot({ path: testInfo.outputPath('warehouse-welcome.png') }); await hover(1055, 760); await page.waitForTimeout(160); await page.screenshot({ path: testInfo.outputPath('warehouse-welcome-hover.png') }); await point(1055, 760); await page.waitForTimeout(350)
  await point(595, 500); await page.waitForTimeout(350); await page.screenshot({ path: testInfo.outputPath('warehouse-prepare.png') })
  for (const [x, y] of [[475,325],[615,325],[755,325],[895,325],[475,510],[615,510],[755,510],[895,510],[1035,510]]) await point(x, y)
  await point(768, 875); await page.waitForTimeout(400); await page.screenshot({ path: testInfo.outputPath('warehouse-delivery.png') })
  const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing')
  for (let i = 0; i < 5; i++) {
    const x = 300 + i * 120
    await page.mouse.move(b.x + x / 1536 * b.width, b.y + 832 / 1024 * b.height)
    await page.mouse.down(); await page.waitForTimeout(35); await page.mouse.move(b.x + 900 / 1536 * b.width, b.y + 510 / 1024 * b.height, { steps: 8 }); await page.waitForTimeout(35); await page.mouse.up()
  }
  await page.waitForTimeout(1300); await page.screenshot({ path: testInfo.outputPath('warehouse-success.png') })
  expect(await page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('warehouse-delivery'))).toBe(true)
  await point(1000, 780); await page.waitForTimeout(250); await point(768, 760)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? [])).toContain('FarmMap')
  expect(failures).toEqual([]); expect(errors).toEqual([])
})

test('each Warehouse order shows only the goods printed on its selected card', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  const failures: string[] = []; const errors: string[] = []
  page.on('requestfailed', r => { if (r.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(r.url()) })
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  const orders: Array<[number, string[]]> = [
    [255, ['wh-delivery-milk']],
    [595, ['wh-delivery-milk', 'wh-delivery-milk', 'wh-delivery-milk', 'wh-delivery-carrot', 'wh-delivery-carrot']],
    [935, ['wh-delivery-egg']],
    [1275, ['wh-delivery-worm', 'wh-delivery-worm', 'wh-delivery-worm']],
  ]
  for (const [x, expected] of orders) {
    await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('Warehouse'))
    await page.waitForTimeout(250); await point(638, 600); await point(1055, 760); await page.waitForTimeout(250)
    await point(x, 500); await page.waitForTimeout(250)
    for (const [itemX, itemY] of [[475,325],[615,325],[755,325],[895,325],[475,510],[615,510],[755,510],[895,510],[1035,510]]) await point(itemX, itemY)
    await point(768, 875); await page.waitForTimeout(350)
    const shown = await page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('Warehouse').flatMap(object => object.texture ? [object.texture] : []).filter(texture => ['wh-delivery-milk', 'wh-delivery-carrot', 'wh-delivery-egg', 'wh-delivery-worm'].includes(texture)).sort())
    expect(shown).toEqual([...expected].sort())
    if (x === 935) await page.screenshot({ path: testInfo.outputPath('warehouse-sheep-one-egg.png') })
    const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing')
    const startX = 540 - (expected.length - 1) * 60
    for (let i = 0; i < expected.length; i++) {
      await page.mouse.move(box.x + (startX + i * 120) / 1536 * box.width, box.y + 832 / 1024 * box.height)
      await page.mouse.down(); await page.mouse.move(box.x + 900 / 1536 * box.width, box.y + 510 / 1024 * box.height, { steps: 8 }); await page.mouse.up(); await page.waitForTimeout(70)
    }
    await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('Warehouse').some(object => object.labels?.includes('DELIVERY SUCCESS!'))), { timeout: 6_000 }).toBe(true)
  }
  expect(failures).toEqual([]); expect(errors).toEqual([])
})

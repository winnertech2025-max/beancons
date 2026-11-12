import { expect, test } from '@playwright/test'

test('Cow Farm completes feed, bucket, milk and ten-bottle delivery with real pointer input', async ({ page }, testInfo) => {
  test.setTimeout(75_000)
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('CowFarm'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  const drag = async (from: [number, number], to: [number, number]) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.move(b.x + from[0] / 1536 * b.width, b.y + from[1] / 1024 * b.height); await page.mouse.down(); await page.mouse.move(b.x + to[0] / 1536 * b.width, b.y + to[1] / 1024 * b.height, { steps: 8 }); await page.mouse.up() }
  await drag([1090,790], [565,545]); await page.waitForTimeout(1_600)
  await page.screenshot({ path: testInfo.outputPath('cow-vocabulary.png') })
  await point(768,735); await page.waitForTimeout(550); await point(899,681); await page.waitForTimeout(750)
  // Give the pressed button's complete down/up animation time to finish, as a
  // child would between taps, before sending the next deliberate tap.
  for (let i = 0; i < 5; i++) { await point(690,615); await page.waitForTimeout(240) }
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('CowFarm').some(object => object.text?.includes('Drag the milk bottles onto the truck'))), { timeout: 6_000 }).toBe(true)
  for (let i = 0; i < 10; i++) {
    await drag([185 + (i % 5) * 116, 570 + Math.floor(i / 5) * 162], [1050,655])
    await page.waitForTimeout(100)
  }
  await page.screenshot({ path: testInfo.outputPath('cow-ten-bottles.png') })
  await point(768,890); await page.waitForTimeout(1_850)
  await page.screenshot({ path: testInfo.outputPath('cow-truck-departing-with-milk.png') })
  await page.waitForTimeout(550)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('cow-farm'))).toBe(true)
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

import { expect, test } from '@playwright/test'

test('Crop Farm plays every real interaction from seed to harvest', async ({ page }, testInfo) => {
  test.setTimeout(45_000)
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('CropFarm'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  const drag = async (from: [number, number], to: [number, number]) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.move(b.x + from[0] / 1536 * b.width, b.y + from[1] / 1024 * b.height); await page.mouse.down(); await page.mouse.move(b.x + to[0] / 1536 * b.width, b.y + to[1] / 1024 * b.height, { steps: 8 }); await page.mouse.up() }
  await drag([255, 660], [470, 570]); await page.waitForTimeout(250); await point(768, 850)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('CropFarm').filter(object => object.texture === 'drive-crop-worm') ?? []), { timeout: 3_000 }).toHaveLength(3)
  const worms = await page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('CropFarm').filter(object => object.texture === 'drive-crop-worm'))
  if (!worms || worms.length !== 3 || worms.some(worm => worm.x === undefined || worm.y === undefined)) throw new Error(`Worm targets missing: ${JSON.stringify(worms)}`)
  // The supplied bug net must be dragged over each real worm; a direct worm
  // tap would bypass the authored tool interaction.
  for (const worm of worms) { await drag([1260, 835], [worm.x!, worm.y!]); await page.waitForTimeout(260) }
  await page.waitForTimeout(500); await point(768, 850); await page.waitForTimeout(10_700)
  await page.screenshot({ path: testInfo.outputPath('crop-harvest-ready.png') })
  await point(768, 890)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('crop-farm'))).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('crop-complete.png') })
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

import { expect, test } from '@playwright/test'

test('Crop Farm requires every seed bag to be dropped into its own matching bed before care begins', async ({ page }, testInfo) => {
  // Includes the real ten-second growing clock after five individual drag/drop actions.
  test.setTimeout(75_000)
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('CropFarm'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  const drag = async (from: [number, number], to: [number, number]) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.move(b.x + from[0] / 1536 * b.width, b.y + from[1] / 1024 * b.height); await page.mouse.down(); await page.mouse.move(b.x + to[0] / 1536 * b.width, b.y + to[1] / 1024 * b.height, { steps: 8 }); await page.mouse.up() }
  const crops = [
    { shelf: [310, 300] as [number, number], bed: [650, 495] as [number, number] },
    { shelf: [425, 300] as [number, number], bed: [360, 602] as [number, number] },
    { shelf: [540, 300] as [number, number], bed: [920, 590] as [number, number] },
    { shelf: [655, 300] as [number, number], bed: [1250, 650] as [number, number] },
    { shelf: [770, 300] as [number, number], bed: [720, 720] as [number, number] },
  ]
  await page.screenshot({ path: testInfo.outputPath('crop-seed-rack.png') })
  // A wrong drop must restore the bag instead of silently advancing the crop flow.
  await drag(crops[0].shelf, [1100, 400])
  await page.waitForTimeout(350)
  const wrongBag = await page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('CropFarm').find(object => object.texture === 'drive-radish-seeds'))
  expect(wrongBag?.x).toBeCloseTo(crops[0].shelf[0], -1)
  expect(wrongBag?.y).toBeCloseTo(crops[0].shelf[1], -1)
  // Each supplied seed packet must go to its own authored soil bed.
  await drag(crops[0].shelf, crops[0].bed); await page.waitForTimeout(260)
  await page.screenshot({ path: testInfo.outputPath('crop-one-seed-planted.png') })
  for (const crop of crops.slice(1)) { await drag(crop.shelf, crop.bed); await page.waitForTimeout(180) }
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('CropFarm').some(object => object.labels?.includes('TƯỚI NƯỚC'))), { timeout: 3_000 }).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('crop-all-seeds-planted.png') })
  await point(768, 850)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('CropFarm').filter(object => ['drive-crop-worm', 'drive-crop-ladybug'].includes(object.texture ?? '')) ?? []), { timeout: 3_000 }).toHaveLength(3)
  const pests = await page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('CropFarm').filter(object => ['drive-crop-worm', 'drive-crop-ladybug'].includes(object.texture ?? '')))
  if (!pests || pests.length !== 3 || pests.some(pest => pest.x === undefined || pest.y === undefined)) throw new Error(`Pest targets missing: ${JSON.stringify(pests)}`)
  // The supplied bug net must be dragged over each real pest; a direct pest
  // tap would bypass the authored tool interaction.
  for (const pest of pests) { await drag([1260, 835], [pest.x!, pest.y!]); await page.waitForTimeout(260) }
  await page.waitForTimeout(500); await point(768, 850); await page.waitForTimeout(10_700)
  await page.screenshot({ path: testInfo.outputPath('crop-harvest-ready.png') })
  await point(768, 890)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('crop-farm'))).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('crop-complete.png') })
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

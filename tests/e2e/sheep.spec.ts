import { expect, test } from '@playwright/test'

test('Sheep Farm uses the authored flow through feed, shear, wool collection and count', async ({ page }, testInfo) => {
  test.setTimeout(60_000)
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('SheepFarm'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing'); await page.mouse.click(box.x + x / 1536 * box.width, box.y + y / 1024 * box.height) }
  const drag = async (from: [number, number], to: [number, number]) => { const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing'); await page.mouse.move(box.x + from[0] / 1536 * box.width, box.y + from[1] / 1024 * box.height); await page.mouse.down(); await page.mouse.move(box.x + to[0] / 1536 * box.width, box.y + to[1] / 1024 * box.height, { steps: 8 }); await page.mouse.up() }
  await page.waitForTimeout(400); await page.screenshot({ path: testInfo.outputPath('sheep-intro.png') })
  await point(768, 890)
  for (const target of [[430,560], [768,560], [1105,560]] as [number, number][]) { await drag([768,820], target); await page.waitForTimeout(120) }
  await page.waitForTimeout(650); await point(768,890); await page.waitForTimeout(180)
  await point(768,835); await point(768,835); await point(768,835)
  await page.waitForTimeout(650); await page.screenshot({ path: testInfo.outputPath('sheep-wool.png') })
  for (const pointAt of [[420,700],[550,790],[680,700],[810,790],[940,700],[445,850],[595,880],[765,860],[930,875]] as [number, number][]) { await point(...pointAt); await page.waitForTimeout(80) }
  await page.waitForTimeout(650); await point(768,890); await page.waitForTimeout(160); await point(768,805)
  await page.waitForTimeout(700); await page.screenshot({ path: testInfo.outputPath('sheep-final.png') })
  expect(await page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('sheep-farm'))).toBe(true)
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

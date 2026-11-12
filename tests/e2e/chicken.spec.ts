import { expect, test } from '@playwright/test'

test('Chicken Farm completes all four Level 1 script beats with real pointer input', async ({ page }, testInfo) => {
  test.setTimeout(90_000)
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => failures.push(request.url()))
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('ChickenFarm'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing'); await page.mouse.click(box.x + x / 1536 * box.width, box.y + y / 1024 * box.height) }
  const drag = async (from: [number, number], to: [number, number]) => { const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing'); await page.mouse.move(box.x + from[0] / 1536 * box.width, box.y + from[1] / 1024 * box.height); await page.mouse.down(); await page.mouse.move(box.x + to[0] / 1536 * box.width, box.y + to[1] / 1024 * box.height, { steps: 8 }); await page.mouse.up() }
  await page.waitForTimeout(400); await page.screenshot({ path: testInfo.outputPath('chicken-meet.png') })
  await point(475, 550); await point(1055, 552); await page.waitForTimeout(700)
  await point(480, 548); await point(1055, 548); await page.waitForTimeout(450); await page.screenshot({ path: testInfo.outputPath('chicken-feed.png') })
  await drag([230, 430], [1110, 630]); await page.waitForTimeout(650); await point(768, 600); await page.waitForTimeout(350); await page.screenshot({ path: testInfo.outputPath('chicken-eggs.png') })
  for (let i = 0; i < 10; i++) { await point(475, 575); await page.waitForTimeout(400) }
  await point(768, 895); await page.waitForTimeout(250); await point(390, 825); await point(768, 560); await page.waitForTimeout(500); await page.screenshot({ path: testInfo.outputPath('chicken-complete.png') })
  expect(await page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('chicken-farm'))).toBe(true)
  await point(575, 830); await page.waitForTimeout(250)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('ChickenFarm').some(object => object.labels?.includes('TRANG TRẠI GÀ · LEVEL 2')))).toBe(true)
  // Tapping an unrelated part of the illustration must not replay or reset Level 1.
  await point(760, 820); await page.waitForTimeout(180)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('ChickenFarm').some(object => object.labels?.includes('TRANG TRẠI GÀ · LEVEL 2')))).toBe(true)
  await point(900, 700); await page.waitForTimeout(250)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('ChickenFarm').some(object => object.text === 'EGGS FOUND\n0 / 10'))).toBe(true)
  for (const [x, y] of [[285,555],[605,690],[995,450],[265,355],[1235,685]]) await point(x, y)
  await page.waitForTimeout(700); await page.screenshot({ path: testInfo.outputPath('chicken-level2-complete.png') })
  expect(await page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('chicken-farm:level-2'))).toBe(true)
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

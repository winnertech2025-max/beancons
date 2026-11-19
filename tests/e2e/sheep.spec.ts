import { expect, test } from '@playwright/test'

test('Sheep Farm follows the three-level scripted child flow with real pointer input', async ({ page }, testInfo) => {
  test.setTimeout(100_000)
  const errors: string[] = []; const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => { if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url()) })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('SheepFarm'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.click(b.x + x / 1536 * b.width, b.y + y / 1024 * b.height) }
  const drag = async (from: [number, number], to: [number, number]) => { const b = await canvas.boundingBox(); if (!b) throw new Error('Canvas missing'); await page.mouse.move(b.x + from[0] / 1536 * b.width, b.y + from[1] / 1024 * b.height); await page.mouse.down(); await page.mouse.move(b.x + to[0] / 1536 * b.width, b.y + to[1] / 1024 * b.height, { steps: 8 }); await page.mouse.up() }
  const sceneText = async () => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('SheepFarm').map(item => item.text ?? item.labels?.join(' ') ?? '').join('\n') ?? '')
  const byTexture = async (texture: string): Promise<[number, number]> => {
    const item = await expect.poll(async () => page.evaluate((key) => window.__HAPPY_FARM_QA__?.objects('SheepFarm').find(object => object.texture === key), texture), { timeout: 5_000 }).toBeTruthy()
    void item
    const point = await page.evaluate((key) => window.__HAPPY_FARM_QA__?.objects('SheepFarm').find(object => object.texture === key), texture)
    const x = Number(point?.x); const y = Number(point?.y)
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error(`Missing usable coordinates for ${texture}`)
    return [x, y]
  }
  const button = async (label: string): Promise<[number, number]> => {
    const point = await page.evaluate((target) => window.__HAPPY_FARM_QA__?.objects('SheepFarm').find(item => item.labels?.includes(target)), label)
    const x = Number(point?.x); const y = Number(point?.y)
    if (!Number.isFinite(x) || !Number.isFinite(y)) throw new Error(`Missing usable coordinates for answer button ${label}`)
    return [x, y]
  }
  await page.screenshot({ path: testInfo.outputPath('sheep-intro.png') })
  await point(768,824); await page.waitForTimeout(400); await point(155,770); await page.waitForTimeout(240)
  for (const [index, target] of ([[430,545],[768,545],[1106,545]] as [number,number][]).entries()) {
    await drag(await byTexture('s-grass-v2'), target); await expect.poll(sceneText, { timeout: 3_000 }).toContain(`SHEEP FED: ${index + 1} / 3`)
  }
  await page.waitForTimeout(800); await point(768,824); await page.waitForTimeout(220); await point(768,824); await page.waitForTimeout(220); await point(430,570); await page.waitForTimeout(160)
  for (let i=0;i<3;i++) { await drag(await byTexture('s-scissors'),[1000,475]); await page.waitForTimeout(180) }
  await page.waitForTimeout(800); await point(160,765); await page.waitForTimeout(180); await drag([300,760],[1120,690]); await page.waitForTimeout(160)
  for (const source of [[370,690],[510,790],[660,710],[790,800],[930,690],[1010,800]] as [number,number][]) { await drag(source,[1120,690]); await page.waitForTimeout(170) }
  await page.waitForTimeout(800); await page.screenshot({ path: testInfo.outputPath('sheep-wool-collected.png') })
  await point(768,824); await page.waitForTimeout(220); await point(768,824); await page.waitForTimeout(220)
  for (const x of [330,545,760,975,1190]) { await point(x,545); await page.waitForTimeout(120) }
  await page.waitForTimeout(700)
  // Answers are intentionally shuffled, so locate the real rendered answer
  // then press it with the pointer.  This proves the child flow without
  // reaching into scene state or relying on a fixed visual order.
  for (const answer of ['1','2','3','4','5']) {
    const [x, y] = await button(answer); await point(x, y); await page.waitForTimeout(760)
  }
  await page.waitForTimeout(900); await page.screenshot({ path: testInfo.outputPath('sheep-final.png') })
  expect(await page.evaluate(() => window.__HAPPY_FARM_QA__?.state().completedActivities.includes('sheep-farm'))).toBe(true)
  expect(errors).toEqual([]); expect(failures).toEqual([])
})

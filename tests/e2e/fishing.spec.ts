import { expect, test } from '@playwright/test'

test('Fishing Lake uses the supplied girl-in-boat control through cast, reel, and answer', async ({ page }, testInfo) => {
  test.setTimeout(45_000)
  const errors: string[] = []
  const failures: string[] = []
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
  page.on('requestfailed', request => {
    if (request.failure()?.errorText !== 'net::ERR_ABORTED') failures.push(request.url())
  })
  await page.goto('/', { waitUntil: 'commit' })
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
  await page.evaluate(() => window.__HAPPY_FARM_QA__?.start('FishingLake'))
  const canvas = page.locator('canvas'); await expect(canvas).toBeVisible()
  const point = async (x: number, y: number) => {
    const box = await canvas.boundingBox(); if (!box) throw new Error('Canvas missing')
    await page.mouse.click(box.x + x / 1536 * box.width, box.y + y / 1024 * box.height)
  }
  const movingControl = async (label: string) => expect.poll(async () => page.evaluate((wanted) => {
    const item = window.__HAPPY_FARM_QA__?.objects('FishingLake').find(object => object.labels?.includes(wanted))
    return item?.x !== undefined && item?.y !== undefined ? { x: item.x, y: item.y } : null
  }, label), { timeout: 7_000 }).not.toBeNull()

  await page.waitForTimeout(450)
  await page.screenshot({ path: testInfo.outputPath('fishing-girl-boat.png') })
  await movingControl('THẢ CẦN')
  const cast = await page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('FishingLake').find(object => object.labels?.includes('THẢ CẦN')))
  if (!cast?.x || !cast.y) throw new Error('Girl-in-boat cast target missing')
  await point(cast.x, cast.y)
  await movingControl('KÉO CẦN')
  const reel = await page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('FishingLake').find(object => object.labels?.includes('KÉO CẦN')))
  if (!reel?.x || !reel.y) throw new Error('Girl-in-boat reel target missing')
  await point(reel.x, reel.y)
  await page.waitForTimeout(750)
  await page.screenshot({ path: testInfo.outputPath('fishing-catch.png') })
  await point(520, 812)
  await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.objects('FishingLake').some(object => object.labels?.includes('HỒ NƯỚC · LEVEL 2'))), { timeout: 6_000 }).toBe(true)
  expect(errors).toEqual([])
  expect(failures).toEqual([])
})

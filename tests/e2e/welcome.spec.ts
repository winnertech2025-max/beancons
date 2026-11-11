import { expect, test } from '@playwright/test'

type QaState = { scenes: string[]; state: { avatar: string | null; stars: number } }

test.describe('Happy Farm opening flow', () => {
  test('never strands loading, then reaches Welcome and starts the avatar flow', async ({ page }, testInfo) => {
    const consoleErrors: string[] = []
    const failedRequests: string[] = []
    page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()) })
    page.on('requestfailed', (request) => failedRequests.push(`${request.method()} ${request.url()}`))

    await page.goto('/', { waitUntil: 'commit' })
    // Media readiness differs under headless Chromium. The opening must never
    // strand the child whether it plays or uses App's explicit five-second handoff.
    await page.waitForTimeout(300)
    await page.screenshot({ path: testInfo.outputPath('loading-video.png') })

    await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 20_000 }).toContain('Welcome')
    await page.screenshot({ path: testInfo.outputPath('welcome.png') })

    const canvas = page.locator('canvas')
    const box = await canvas.boundingBox()
    expect(box).not.toBeNull()
    // Real pointer click on the supplied-art start banner, not a scene jump test hook.
    await page.mouse.click(box!.x + (408 / 1536) * box!.width, box!.y + (680 / 1024) * box!.height)
    await expect.poll(() => page.evaluate(() => window.__HAPPY_FARM_QA__?.scenes() ?? []), { timeout: 3_000 }).toContain('Avatar')
    const qa = await page.evaluate(() => ({ scenes: window.__HAPPY_FARM_QA__?.scenes() ?? [], state: window.__HAPPY_FARM_QA__?.state() })) as QaState
    expect(qa.state.avatar).toBeNull()
    expect(consoleErrors).toEqual([])
    expect(failedRequests).toEqual([])
  })
})

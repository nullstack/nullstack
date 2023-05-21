beforeEach(async () => {
  await page.goto('http://localhost:6969/window-fragment')
})

describe('WindowFragment', () => {
  test('the window behaves as a fragment and creates no markup', async () => {
    const element = await page.$('[data-window-parent] > [data-window-child]')
    expect(element).toBeTruthy()
  })

  test('the window ignores non attribute events', async () => {
    const element = await page.$('[data-window-parent] > [data-window-child]')
    expect(element).toBeTruthy()
  })

  test('when the window is nested events are invoked sequentially', async () => {
    await page.waitForSelector('[data-hydrated]')
    await page.click('body')
    await page.waitForSelector('[data-count="1"][data-objected]')
    const element = await page.$('[data-count="1"][data-objected]')
    expect(element).toBeTruthy()
  })

  test('the window removes events when the fragment leaves the tree', async () => {
    await page.waitForSelector('[data-hydrated]')
    await page.click('[href="/"]')
    await page.waitForSelector('[data-application-hydrated]:not([data-count])')
    await page.click('body')
    const element = await page.$('[data-application-hydrated]:not([data-count])')
    expect(element).toBeTruthy()
  })
})

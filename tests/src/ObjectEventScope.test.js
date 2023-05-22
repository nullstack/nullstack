describe('OptimizedEvents', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:6969/object-event-scope')
    await page.waitForSelector('[data-hydrated]')
  })

  test('single object events run in declaration scope on render', async () => {
    await page.click('#render-single-object')
    await page.waitForSelector('[data-boolean]')
    const element = await page.$('[data-boolean]')
    expect(element).toBeTruthy()
  })

  test('array object events run in declaration scope on render', async () => {
    await page.click('#render-object-array')
    await page.waitForSelector('[data-boolean]')
    const element = await page.$('[data-boolean]')
    expect(element).toBeTruthy()
  })

  test('single object events run in declaration scope on rerender', async () => {
    await page.click('#rerender')
    await page.waitForSelector('#rerender-single-object')
    await page.click('#rerender-single-object')
    await page.waitForSelector('[data-boolean]')
    const element = await page.$('[data-boolean]')
    expect(element).toBeTruthy()
  })

  test('array object events run in declaration scope on rerender', async () => {
    await page.click('#rerender')
    await page.waitForSelector('#rerender-object-array')
    await page.click('#render-object-array')
    await page.waitForSelector('[data-boolean]')
    const element = await page.$('[data-boolean]')
    expect(element).toBeTruthy()
  })
})

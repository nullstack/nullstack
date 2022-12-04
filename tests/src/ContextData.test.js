beforeAll(async () => {
  await page.goto('http://localhost:6969/context-data')
})

describe('ContextData', () => {
  test('data attributes are added to the dom', async () => {
    const element = await page.$('[data-multiply-by="3"]')
    expect(element).toBeTruthy()
  })

  test('data attributes are merged into the data attribute and passed to events', async () => {
    await page.click('[data-multiply-by="3"]')
    await page.waitForSelector('[data-count-with-default="6"]')
    const element = await page.$('[data-count-with-default="6"]')
    expect(element).toBeTruthy()
  })

  test('data attributes are added into a new data object and passed to events if no data attribute is provided', async () => {
    await page.click('[data-set-to="2"]')
    await page.waitForSelector('[data-count-without-default="2"]')
    const element = await page.$('[data-count-without-default="2"]')
    expect(element).toBeTruthy()
  })

  test('data attributes are kebabized when generating the data argument', async () => {
    await page.click('[data-set-to="2"]')
    await page.waitForSelector('[data-count-without-default="2"]')
    const element = await page.$('[data-count-without-default="2"]')
    expect(element).toBeTruthy()
  })
})

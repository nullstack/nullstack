beforeAll(async () => {
  await page.goto('http://localhost:6969/date-parser')
})

describe('DateParser', () => {
  test('dates in the instance are instances of Date in ssr mode', async () => {
    const element = await page.$('[data-ssr-instance-year="92"]')
    expect(element).toBeTruthy()
  })

  test('dates in the context are instances of Date in ssr mode', async () => {
    const element = await page.$('[data-ssr-context-year="92"]')
    expect(element).toBeTruthy()
  })

  test('dates in the instance are instances of Date in spa mode', async () => {
    await page.waitForSelector('[data-spa-instance-year="92"]')
    const element = await page.$('[data-spa-instance-year="92"]')
    expect(element).toBeTruthy()
  })

  test('dates in the context are instances of Date in spa mode', async () => {
    await page.waitForSelector('[data-spa-context-year="92"]')
    const element = await page.$('[data-spa-context-year="92"]')
    expect(element).toBeTruthy()
  })
})

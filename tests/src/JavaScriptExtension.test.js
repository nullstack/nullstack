beforeAll(async () => {
  await page.goto('http://localhost:6969/javascript-extension')
})

describe('JavaScriptExtension', () => {
  test('components can use the jsx extension', async () => {
    await page.waitForSelector('[data-imported]')
    const element = await page.$('[data-imported]')
    expect(element).toBeTruthy()
  })
})

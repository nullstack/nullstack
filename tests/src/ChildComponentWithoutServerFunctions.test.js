beforeAll(async () => {
  await page.goto('http://localhost:6969/child-component-without-server-functions')
})

describe('ChildComponentWithoutServerFunctions', () => {
  test('inherited server functions are bound to the class ssr', async () => {
    const element = await page.$('[data-parent-this]')
    expect(element).toBeTruthy()
  })

  test('inherited server functions are bound to the class spa', async () => {
    await page.waitForSelector('[data-hydrated-parent-this]')
    const element = await page.$('[data-hydrated-parent-this]')
    expect(element).toBeTruthy()
  })
})

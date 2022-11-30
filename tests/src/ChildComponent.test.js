beforeAll(async () => {
  await page.goto('http://localhost:6969/child-component')
})

describe('ChildComponent', () => {
  test('Nullstack is auto imported when using inheritance', async () => {
    const element = await page.$('[data-current="ChildComponent"]')
    expect(element).toBeTruthy()
  })

  test('inner components are overridable', async () => {
    const element = await page.$('[data-current]')
    expect(element).toBeTruthy()
  })

  test('server functions are bound to the class in ssr', async () => {
    const element = await page.$('[data-child-this]')
    expect(element).toBeTruthy()
  })

  test('inherited server functions are bound to the class ssr', async () => {
    const element = await page.$('[data-parent-this]')
    expect(element).toBeTruthy()
  })

  test('server functions are bound to the class in spa', async () => {
    await page.waitForSelector('[data-hydrated-child-this]')
    const element = await page.$('[data-hydrated-child-this]')
    expect(element).toBeTruthy()
  })

  test('inherited server functions are bound to the class spa', async () => {
    await page.waitForSelector('[data-hydrated-parent-this]')
    const element = await page.$('[data-hydrated-parent-this]')
    expect(element).toBeTruthy()
  })

  test('static inherited server functions are bound to the original class spa', async () => {
    await page.waitForSelector('[data-static-hydrated-parent-this]')
    const element = await page.$('[data-static-hydrated-parent-this]')
    expect(element).toBeTruthy()
  })

  test('static inherited server functions are bound to the original class ssr', async () => {
    await page.waitForSelector('[data-static-parent-this]')
    const element = await page.$('[data-static-parent-this]')
    expect(element).toBeTruthy()
  })

  test('static server functions are bound to the class in spa', async () => {
    await page.waitForSelector('[data-static-hydrated-child-this]')
    const element = await page.$('[data-static-hydrated-child-this]')
    expect(element).toBeTruthy()
  })

  test('static server functions are bound to the class in srs', async () => {
    await page.waitForSelector('[data-static-child-this]')
    const element = await page.$('[data-static-child-this]')
    expect(element).toBeTruthy()
  })

  test('Nullstack is injected in tsx files', async () => {
    await page.waitForSelector('[data-static-child-this]')
    const element = await page.$('[data-static-child-this]')
    expect(element).toBeTruthy()
  })
})

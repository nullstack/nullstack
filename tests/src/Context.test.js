beforeAll(async () => {
  await page.goto('http://localhost:6969/context')
})

describe('Context', () => {
  test('setting a key to the server context makes it permanent', async () => {
    const element = await page.$('[data-framework="Nullstack"]')
    expect(element).toBeTruthy()
  })

  test('keys of the server context are available to all server functions', async () => {
    const element = await page.$('[data-framework="Nullstack"]')
    expect(element).toBeTruthy()
  })

  test('setting a key to the client context makes it permanent', async () => {
    const element = await page.$('[data-framework="Nullstack"]')
    expect(element).toBeTruthy()
  })

  test('keys of the client context are available to all client functions', async () => {
    const element = await page.$('[data-framework="Nullstack"]')
    expect(element).toBeTruthy()
  })

  test('the client context is merged into all instance methods', async () => {
    const element = await page.$('[data-framework-initial="N"]')
    expect(element).toBeTruthy()
  })

  test('hydrated static async underline function has no context', async () => {
    await page.waitForSelector('[data-hydrated-static-async-underline-function-has-no-context]')
    const element = await page.$('[data-hydrated-static-async-underline-function-has-no-context]')
    expect(element).toBeTruthy()
  })

  test('hydrated static underline function has no context', async () => {
    await page.waitForSelector('[data-hydrated-static-underline-function-has-no-context]')
    const element = await page.$('[data-hydrated-static-underline-function-has-no-context]')
    expect(element).toBeTruthy()
  })

  test('hydrated static function has no context', async () => {
    await page.waitForSelector('[data-hydrated-static-function-has-no-context]')
    const element = await page.$('[data-hydrated-static-function-has-no-context]')
    expect(element).toBeTruthy()
  })

  test('static async underline function has no context', async () => {
    await page.waitForSelector('[data-static-async-underline-function-has-no-context]')
    const element = await page.$('[data-static-async-underline-function-has-no-context]')
    expect(element).toBeTruthy()
  })

  test('static underline function has no context', async () => {
    await page.waitForSelector('[data-static-underline-function-has-no-context]')
    const element = await page.$('[data-static-underline-function-has-no-context]')
    expect(element).toBeTruthy()
  })

  test('static function has no context', async () => {
    await page.waitForSelector('[data-static-function-has-no-context]')
    const element = await page.$('[data-static-function-has-no-context]')
    expect(element).toBeTruthy()
  })
})

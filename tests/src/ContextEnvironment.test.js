beforeAll(async () => {
  await page.goto('http://localhost:6969/context-environment')
})

describe('ContextEnvironment', () => {
  test('is part of the client context', async () => {
    const element = await page.$('[data-environment]')
    expect(element).toBeTruthy()
  })

  test('has a client key', async () => {
    await page.waitForSelector('[data-client="true"]')
    const element = await page.$('[data-client="true"]')
    expect(element).toBeTruthy()
  })

  test('has a server key', async () => {
    await page.waitForSelector('[data-server="false"]')
    const element = await page.$('[data-server="false"]')
    expect(element).toBeTruthy()
  })

  test('has a development key', async () => {
    const element = await page.$('[data-development="false"]')
    expect(element).toBeTruthy()
  })

  test('has a production key', async () => {
    const element = await page.$('[data-production="true"]')
    expect(element).toBeTruthy()
  })

  test('has a static key', async () => {
    const element = await page.$('[data-static="false"]')
    expect(element).toBeTruthy()
  })

  test('has a key with the environment hash', async () => {
    const element = await page.$('[data-key]')
    expect(element).toBeTruthy()
  })

  test('has a key with the environment name', async () => {
    const element = await page.$('[data-name=""]')
    expect(element).toBeTruthy()
  })
})

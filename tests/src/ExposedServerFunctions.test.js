beforeAll(async () => {
  await page.goto('http://localhost:6969/exposed-server-functions')
})

describe('ExposedServerFunctions', () => {
  test('routes are chainable when receiving a server function', async () => {
    await page.waitForSelector('[data-chainable-server-function]')
    const element = await page.$('[data-chainable-server-function]')
    expect(element).toBeTruthy()
  })

  test('routes are chainable when receiving a regular function', async () => {
    await page.waitForSelector('[data-chainable-regular-function]')
    const element = await page.$('[data-chainable-regular-function]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to GET and serialize params and query', async () => {
    await page.waitForSelector('[data-get]')
    const element = await page.$('[data-get]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to POST and serialize params and query and body as text', async () => {
    await page.waitForSelector('[data-post]')
    const element = await page.$('[data-post]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to POST and serialize params and query and body as json', async () => {
    await page.waitForSelector('[data-post-json]')
    const element = await page.$('[data-post-json]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to PUT and serialize params and query and body as text', async () => {
    await page.waitForSelector('[data-put]')
    const element = await page.$('[data-put]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to PUT and serialize params and query and body as json', async () => {
    await page.waitForSelector('[data-put-json]')
    const element = await page.$('[data-put-json]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to PATCH and serialize params and query and body as text', async () => {
    await page.waitForSelector('[data-patch]')
    const element = await page.$('[data-patch]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to PATCH and serialize params and query and body as json', async () => {
    await page.waitForSelector('[data-patch-json]')
    const element = await page.$('[data-patch-json]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to DELETE and serialize params and query and body as text', async () => {
    await page.waitForSelector('[data-delete]')
    const element = await page.$('[data-delete]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to DELETE and serialize params and query and body as json', async () => {
    await page.waitForSelector('[data-delete-json]')
    const element = await page.$('[data-delete-json]')
    expect(element).toBeTruthy()
  })

  test('server functions can be exposed to ALL and serialize params and query and body', async () => {
    await page.waitForSelector('[data-all]')
    const element = await page.$('[data-all]')
    expect(element).toBeTruthy()
  })
})

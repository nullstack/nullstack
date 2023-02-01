beforeAll(async () => {
  await page.goto('http://localhost:6969/reqres')
  await page.waitForSelector('[data-hydrated]')
})

describe('ReqRes', () => {
  test('server functions keep the request', async () => {
    await page.waitForSelector('[data-server-function]')
    const element = await page.$('[data-server-function]')
    expect(element).toBeTruthy()
  })

  test('nested server functions keep the request', async () => {
    await page.waitForSelector('[data-nested-server-function]')
    const element = await page.$('[data-nested-server-function]')
    expect(element).toBeTruthy()
  })

  test('server functions keep the request when invoked by the client', async () => {
    await page.waitForSelector('[data-server-function-from-client]')
    const element = await page.$('[data-server-function-from-client]')
    expect(element).toBeTruthy()
  })

  test('nested server functions keep the request when invoked by the client', async () => {
    await page.waitForSelector('[data-nested-server-function-from-client]')
    const element = await page.$('[data-nested-server-function-from-client]')
    expect(element).toBeTruthy()
  })

  test('exposed server functions keep the request', async () => {
    await page.waitForSelector('[data-exposed-server-function]')
    const element = await page.$('[data-exposed-server-function]')
    expect(element).toBeTruthy()
  })

  test('nested exposed server functions keep the request', async () => {
    await page.waitForSelector('[data-exposed-nested-server-function]')
    const element = await page.$('[data-exposed-nested-server-function]')
    expect(element).toBeTruthy()
  })
})

describe('ErrorPage 500', () => {
  let response

  beforeAll(async () => {
    response = await page.goto('http://localhost:6969/error-page?status=500', { waitUntil: 'networkidle0' })
  })

  test('pages with error have a 500 status', async () => {
    const status = response.status()
    expect(status).toBe(500)
  })

  test('pages with error have a status key with the value 500', async () => {
    await page.waitForSelector('[data-page-status="500"]')
    const element = await page.$('[data-page-status="500"]')
    expect(element).toBeTruthy()
  })
})

describe('ErrorPage 404', () => {
  test('pages with status 404 have a 404 status', async () => {
    const response = await page.goto('http://localhost:6969/error-page', { waitUntil: 'networkidle0' })
    const status = response.status()
    expect(status).toBe(404)
  })

  test('pages status reflects on the client context', async () => {
    await page.waitForSelector('[data-page-status="404"]')
    const element = await page.$('[data-page-status="404"]')
    expect(element).toBeTruthy()
  })
})

describe('ErrorPage offline', () => {
  test('the offline template should always have a 200 status', async () => {
    await page.goto('http://localhost:6969', { waitUntil: 'networkidle0' })
    const link = await page.$eval('a', (element) => element.href)
    const response = await page.goto(link, { waitUntil: 'networkidle0' })
    const status = response.status()
    expect([200, 304]).toContain(status)
  })
})

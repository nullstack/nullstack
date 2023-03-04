beforeAll(async () => {
  await page.goto('http://localhost:6969/logo')
})

describe('Logo', () => {
  test('logo can be imported', async () => {
    const element = await page.$('svg[viewBox="0 0 511.5039 113.7368"]')
    expect(element).toBeTruthy()
  })
})
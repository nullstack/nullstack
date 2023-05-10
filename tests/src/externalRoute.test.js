beforeAll(async () => {
  await page.goto('http://localhost:6969/external-route.json')
})

describe('ExtermalRoute', () => {
  test('express functions keep their priority', async () => {
    const response = await page.evaluate(() => {
      return JSON.parse(document.querySelector('body').innerText)
    })
    expect(response.nice === 69).toBeTruthy()
  })
})

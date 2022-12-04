beforeAll(async () => {
  await page.goto('http://localhost:6969/text-observer')
  await page.waitForSelector('[data-mutated]')
})

describe('TextObserver', () => {
  test('regular text should never be mutated', async () => {
    const element = await page.$('[data-regular-text]:not([data-mutated])')
    expect(element).toBeTruthy()
  })

  test('unmutated text should not be mutated', async () => {
    const element = await page.$('[data-unmutated-text]:not([data-mutated])')
    expect(element).toBeTruthy()
  })

  test('mutated text should be mutated and redundancy should be redundant', async () => {
    const element = await page.$('[data-mutated-text][data-mutated]')
    expect(element).toBeTruthy()
  })
})

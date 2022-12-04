beforeAll(async () => {
  await page.goto('http://localhost:6969/element')
})

describe('FullStackLifecycle', () => {
  test('elements can receive any tag b', async () => {
    const element = await page.$('b[data-tag="b"]')
    expect(element).toBeTruthy()
  })

  test('elements can receive any tag abbr', async () => {
    const element = await page.$('abbr[data-tag="abbr"]')
    expect(element).toBeTruthy()
  })

  test('elements without tag become fragments', async () => {
    const element = await page.$('[data-tag="fragment"]')
    expect(element).toBeFalsy()
  })

  test('elements can be inner components and receive props', async () => {
    const element = await page.$('[data-inner-component]')
    expect(element).toBeTruthy()
  })

  test('elements can be class components and receive props', async () => {
    const element = await page.$('[data-class-component]')
    expect(element).toBeTruthy()
  })

  test('elements can be functional components and receive props', async () => {
    const element = await page.$('[data-functional-component]')
    expect(element).toBeTruthy()
  })
})

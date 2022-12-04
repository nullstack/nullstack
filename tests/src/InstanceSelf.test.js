beforeAll(async () => {
  await page.goto('http://localhost:6969/instance-self')
})

describe('InstanceSelf', () => {
  test('instance is aware that the component initiated', async () => {
    await page.waitForSelector('[data-initiated]')
    const element = await page.$('[data-initiated]')
    expect(element).toBeTruthy()
  })

  test('instance is aware that the component is hydrated', async () => {
    await page.waitForSelector('[data-hydrated]')
    const element = await page.$('[data-hydrated]')
    expect(element).toBeTruthy()
  })

  test('instance is aware that the component was prerendered', async () => {
    await page.waitForSelector('[data-prerendered]')
    const element = await page.$('[data-prerendered]')
    expect(element).toBeTruthy()
  })

  test('instance key has route appended to depth if no key is declared', async () => {
    await page.waitForSelector('[data-key="InstanceSelf/0-0-6/instance-self"]')
    const element = await page.$('[data-key="InstanceSelf/0-0-6/instance-self"]')
    expect(element).toBeTruthy()
  })

  test('instance is aware of the component element after render', async () => {
    await page.waitForSelector('[data-tag="form"]')
    const element = await page.$('[data-tag="form"]')
    expect(element).toBeTruthy()
  })

  test('fragments can be nested', async () => {
    await page.waitForSelector('[data-year="1992"]')
    const element = await page.$('[data-year="1992"]')
    expect(element).toBeTruthy()
  })
})

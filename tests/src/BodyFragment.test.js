beforeEach(async () => {
  await page.goto('http://localhost:6969/body-fragment')
})

describe('BodyFragment', () => {
  test('the body behaves as a fragment and creates no markup', async () => {
    const element = await page.$('body > #application > h1')
    expect(element).toBeTruthy()
  })

  test('when the body is nested regular attributes are overwritten by the last one in the tree', async () => {
    const element = await page.$('body[data-chars="b"]')
    expect(element).toBeTruthy()
  })

  test('when the body is nested classes are merged togheter', async () => {
    const element = await page.$('body[class="class-one class-two class-three class-four"]')
    expect(element).toBeTruthy()
  })

  test('when the body is nested styles are merged togheter', async () => {
    const element = await page.$('body[style="background-color: black; color: white;"]')
    expect(element).toBeTruthy()
  })

  test('when the body is nested events are invoked sequentially', async () => {
    await page.waitForSelector('body[data-hydrated]')
    await page.click('body')
    await page.waitForSelector('[data-keys][data-objected][data-visible]')
    const element = await page.$('[data-keys][data-objected][data-visible]')
    expect(element).toBeTruthy()
  })

  test('when a body is added to the vdom attributes are added', async () => {
    await page.waitForSelector('body[data-hydrated]')
    await page.click('body')
    await page.waitForSelector('body[data-visible]')
    const element = await page.$('body[data-visible]')
    expect(element).toBeTruthy()
  })

  test('when a body is removed from the vdom attributes are removed', async () => {
    await page.waitForSelector('body[data-hydrated]')
    await page.click('body')
    await page.waitForSelector('body[data-visible]')
    await page.click('body')
    await page.waitForSelector('body:not([data-visible])')
    const element = await page.$('body:not([data-visible])')
    expect(element).toBeTruthy()
  })

  test('the body removes events when the fragment leaves the tree', async () => {
    await page.waitForSelector('body[data-hydrated]')
    await page.click('[href="/"]')
    await page.waitForSelector('[data-window="shim"]:not([data-count])')
    await page.click('body')
    const element = await page.$('[data-window="shim"]:not([data-count])')
    expect(element).toBeTruthy()
  })
})

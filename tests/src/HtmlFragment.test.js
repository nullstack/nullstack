beforeEach(async () => {
  await page.goto('http://localhost:6969/html-fragment')
})

describe('HtmlFragment', () => {
  test('the html behaves as a fragment and creates no markup', async () => {
    const element = await page.$('[data-html-parent] > [data-html-child]')
    expect(element).toBeTruthy()
  })

  test('when the html is nested regular attributes are overwritten by the last one in the tree', async () => {
    const element = await page.$('html[data-chars="b"]')
    expect(element).toBeTruthy()
  })

  test('when the html is nested classes are merged togheter', async () => {
    const element = await page.$('html[class="class-one class-two class-three class-four"]')
    expect(element).toBeTruthy()
  })

  test('when the html is nested styles are merged togheter', async () => {
    const element = await page.$('html[style="background-color: black; color: white;"]')
    expect(element).toBeTruthy()
  })

  test('when the html is nested events are invoked sequentially', async () => {
    await page.waitForSelector('html[data-hydrated]')
    await page.click('html')
    await page.waitForSelector('[data-keys][data-objected][data-visible]')
    const element = await page.$('[data-keys][data-objected][data-visible]')
    expect(element).toBeTruthy()
  })

  test('when a html is added to the vdom attributes are added', async () => {
    await page.waitForSelector('html[data-hydrated]')
    await page.click('html')
    await page.waitForSelector('html[data-visible]')
    const element = await page.$('html[data-visible]')
    expect(element).toBeTruthy()
  })

  test('when a html is removed from the vdom attributes are removed', async () => {
    await page.waitForSelector('html[data-hydrated]')
    await page.click('html')
    await page.waitForSelector('html[data-visible]')
    await page.click('html')
    await page.waitForSelector('html:not([data-visible])')
    const element = await page.$('html:not([data-visible])')
    expect(element).toBeTruthy()
  })

  test('the html removes events when the fragment leaves the tree', async () => {
    await page.waitForSelector('html[data-hydrated]')
    await page.click('[href="/"]')
    await page.waitForSelector('[data-application-hydrated]:not([data-count])')
    await page.click('html')
    const element = await page.$('[data-application-hydrated]:not([data-count])')
    expect(element).toBeTruthy()
  })
})

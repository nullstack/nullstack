beforeAll(async () => {
  await page.goto('http://localhost:6969/plugin-attributes')
  await page.waitForSelector('[data-hydrated]')
})

describe('PluginAttributes', () => {
  const toogleElement = async (showTitle, len) => {
    await page.click('button')
    await page.waitForSelector(`[data-btn="${showTitle}"]`)
    const headings = await page.$$('h1')
    expect(headings.length).toBe(len)
  }

  test('Added plugin renders v-html in element', async () => {
    const element = await page.$('[data-vue]')
    const html = await page.evaluate((e) => e.innerHTML, element)
    expect(html).toMatch('<b>Nullstack</b>')
  })

  test('Added plugin uses v-if to toggle element', async () => {
    await toogleElement(true, 1)
    await toogleElement(false, 2)
  })

  const dataTester = (name) => async () => {
    const p = await page.$(`[data-${name}]`)
    expect(p).toBeTruthy()
  }

  test('plugin works only on server', dataTester('changed-server'))

  test('plugin works only on client', dataTester('changed-client'))

  test('plugins have access to context keys on load', dataTester('access-load'))

  test('plugins have access to context keys on transform', dataTester('access-transform'))
})

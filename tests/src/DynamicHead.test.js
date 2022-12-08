beforeEach(async () => {
  await page.goto('http://localhost:6969/dynamic-head')
})

describe('DynamicHead', () => {
  test('styles can be added inline to the head tag during ssr', async () => {
    const color = await page.evaluate('getComputedStyle(document.body.querySelector("[data-red-blue]")).color')
    expect(color).toEqual('rgb(255, 0, 0)')
  })

  test('head styles can be updated dynamicly', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('[data-red-blue][data-count="1"]')
    const color = await page.evaluate('getComputedStyle(document.body.querySelector("[data-red-blue]")).color')
    expect(color).toEqual('rgb(0, 0, 255)')
  })

  test('styles can be added from inner components to the head tag', async () => {
    await page.waitForSelector('[data-inner-component]')
    const color = await page.evaluate('getComputedStyle(document.body.querySelector("[data-inner-component]")).color')
    expect(color).toEqual('rgb(0, 0, 255)')
  })

  test('styles can be added from fragments to the head tag', async () => {
    await page.waitForSelector('[data-fragment]')
    const color = await page.evaluate('getComputedStyle(document.body.querySelector("[data-fragment]")).color')
    expect(color).toEqual('rgb(0, 0, 255)')
  })

  test('styles can be conditionaly prerendered inside the head tag', async () => {
    const color = await page.evaluate(
      'getComputedStyle(document.body.querySelector("[data-prerender-conditional]")).color',
    )
    expect(color).toEqual('rgb(0, 0, 255)')
  })

  test('styles can be conditionaly rerendered inside the head tag', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('head [data-rerender-conditional]')
    const color = await page.evaluate(
      'getComputedStyle(document.body.querySelector("[data-rerender-conditional]")).color',
    )
    expect(color).toEqual('rgb(0, 0, 255)')
  })

  test('styles can be rendered inside a conditionaly rendered head tag', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('head [data-conditional-head]')
    const color = await page.evaluate('getComputedStyle(document.body.querySelector("[data-conditional-head]")).color')
    expect(color).toEqual('rgb(0, 0, 255)')
  })

  test('heads can be replaced by ternaries', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('[data-ternary-span]')
    const element = await page.$('[data-ternary-span]')
    expect(element).toBeTruthy()
  })

  test('heads can be inserted by ternaries', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('[data-ternary-span]')
    await page.click('[data-increment]')
    await page.waitForSelector('[data-ternary-head]')
    const element = await page.$('[data-ternary-head]')
    expect(element).toBeTruthy()
  })

  test('head elements can have custom ids', async () => {
    const element = await page.$('#ternary-head')
    expect(element).toBeTruthy()
  })

  test('the head tag accepts dynamic lists of increasing size', async () => {
    for (let i = 1; i < 3; i++) {
      await page.click('[data-increment]')
      await page.waitForSelector(`[data-dynamic-length="${i}"]`)
    }
    const elements = await page.$$('[data-dynamic-length]')
    expect(elements.length).toEqual(3)
  })

  test('the head tag accepts dynamic lists of decreasing size', async () => {
    for (let i = 1; i < 3; i++) {
      await page.click('[data-increment]')
      await page.waitForSelector(`[data-dynamic-length="${i}"]`)
    }
    await page.click('[data-decrement]')
    await page.waitForSelector('[data-negative-count]')
    const elements = await page.$$('[data-negative-count]')
    expect(elements.length).toEqual(2)
  })

  test('dynamic head elements can update attributes', async () => {
    for (let i = 1; i < 3; i++) {
      await page.click('[data-increment]')
      await page.waitForSelector(`[data-dynamic-length="${i}"]`)
    }
    await page.click('[data-decrement]')
    await page.waitForSelector('[data-negative-count]')
    await page.click('[data-decrement]')
    await page.waitForSelector('[data-dynamic-length]:not([data-negative-count])')
    const element = await page.$('[data-dynamic-length]:not([data-negative-count])')
    expect(element).toBeTruthy()
  })

  test('heads can be replaced in ternaries by heads with a highter children length', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('[data-b2]')
    await page.waitForSelector('[data-b1]')
    const a1 = await page.$('[data-a1]')
    const b1 = await page.$('[data-b1]')
    const b2 = await page.$('[data-b2]')
    expect(!a1 && b1 && b2).toBeTruthy()
  })

  test('heads can be replaced in ternaries by heads with a highter children length', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('[data-b2]')
    await page.waitForSelector('[data-b1]')
    await page.click('[data-increment]')
    await page.waitForSelector('[data-a1]')
    const a1 = await page.$('[data-a1]')
    const b1 = await page.$('[data-b1]')
    const b2 = await page.$('[data-b2]')
    expect(a1 && !b1 && !b2).toBeTruthy()
  })

  test('head children can be ternaries', async () => {
    await page.click('[data-increment]')
    await page.waitForSelector('meta[data-ternary-head-children]')
    await page.click('[data-increment]')
    await page.waitForSelector('style[data-ternary-head-children]')
    const element = await page.$('style[data-ternary-head-children]')
    expect(element).toBeTruthy()
  })

  test('empty script tags in head should have no children', async () => {
    await page.waitForSelector('[data-script-is-empty]')
    const element = await page.$('[data-script-is-empty]')
    expect(element).toBeTruthy()
  })
})

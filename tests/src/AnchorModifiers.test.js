beforeAll(async () => {
  await page.goto('http://localhost:6969/anchor-modifiers');
});

describe('AnchorModifiers jsx', () => {

  test('Clicking html link with shift opens in new window', async () => {
    await page.keyboard.down('Shift');
    await page.click('[href="/anchor-modifiers?source=html"]');
    await page.keyboard.up('Shift');
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/anchor-modifiers');
  });

  test('Clicking html link with control opens in new tab', async () => {
    await page.keyboard.down('Control');
    await page.click('[href="/anchor-modifiers?source=html"]');
    await page.keyboard.up('Control');
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/anchor-modifiers');
  });

  test('Clicking html link with alt downloads the link', async () => {
    await page.keyboard.down('Alt');
    await page.click('[href="/anchor-modifiers?source=html"]');
    await page.keyboard.up('Alt');
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/anchor-modifiers');
  });

  test('Clicking jsx link with shift opens in new window', async () => {
    await page.keyboard.down('Shift');
    await page.click('[href="/anchor-modifiers?source=jsx"]');
    await page.keyboard.up('Shift');
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/anchor-modifiers');
  });

  test('Clicking jsx link with control opens in new tab', async () => {
    await page.keyboard.down('Control');
    await page.click('[href="/anchor-modifiers?source=jsx"]');
    await page.keyboard.up('Control');
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/anchor-modifiers');
  });

  test('Clicking jsx link with alt downloads the link', async () => {
    await page.keyboard.down('Alt');
    await page.click('[href="/anchor-modifiers?source=jsx"]');
    await page.keyboard.up('Alt');
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/anchor-modifiers');
  });

  test('Clicking html link with modifier runs the original event', async () => {
    await page.keyboard.down('Shift');
    await page.click('[href="/anchor-modifiers?source=html"]');
    await page.keyboard.up('Shift');
    await page.waitForSelector('[data-clicked-html]');
    const element = await page.$('[data-clicked-html]');
    expect(element).toBeTruthy();
  });

  test('Clicking jsx link with modifier runs the original event', async () => {
    await page.keyboard.down('Shift');
    await page.click('[href="/anchor-modifiers?source=jsx"]');
    await page.keyboard.up('Shift');
    await page.waitForSelector('[data-clicked-jsx]');
    const element = await page.$('[data-clicked-jsx]');
    expect(element).toBeTruthy();
  });

});
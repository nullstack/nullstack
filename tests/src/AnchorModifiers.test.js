describe('AnchorModifiers jsx', () => {

  beforeEach(async () => {
    await page.goto('http://localhost:6969/anchor-modifiers');
    await page.waitForSelector('[data-hydrated]');
  });

  test('Clicking html link with shift opens in new window', async () => {
    await page.keyboard.down('Shift');
    await page.click('[href="/anchor-modifiers?source=html"]');
    await page.keyboard.up('Shift');
    const url = await page.url()
    expect(url).toEqual('http://localhost:6969/anchor-modifiers');
  });

  test('Clicking html link with control or meta opens in new tab', async () => {
    const key = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.down(key);
    await page.click('[href="/anchor-modifiers?source=html"]');
    await page.keyboard.up(key);
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

  test('Clicking jsx link with control or meta opens in new tab', async () => {
    const key = process.platform === 'darwin' ? 'Meta' : 'Control'
    await page.keyboard.down(key);
    await page.click('[href="/anchor-modifiers?source=jsx"]');
    await page.keyboard.up(key);
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

  test('anchors can have events', async () => {
    await page.click('button');
    await page.click('[href="/anchor-modifiers?source=incremented"]');
    await page.waitForSelector('[data-updated] [data-count="1"]');
    const element = await page.$('[data-updated] [data-count="1"]');
    expect(element).toBeTruthy();
  });

  test('anchors can have object events', async () => {
    await page.click('button');
    await page.click('[href="/anchor-modifiers?source=object"]');
    await page.waitForSelector('[data-updated] [data-objected]');
    const element = await page.$('[data-updated] [data-objected]');
    expect(element).toBeTruthy();
  });

  test('anchors can have array events', async () => {
    await page.click('button');
    await page.click('[href="/anchor-modifiers?source=array"]');
    await page.waitForSelector('[data-updated] [data-count="1"][data-objected]');
    const element = await page.$('[data-updated] [data-count="1"][data-objected]');
    expect(element).toBeTruthy();
  });

});

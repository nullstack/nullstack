describe('Refs', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/');
    await page.click('[href="/refs"]')
  });

  test('refs should be loaded during hydrate', async () => {
    await page.waitForSelector('[data-id="hydrate-element"]');
    const element = await page.$('[data-id="hydrate-element"]');
    expect(element).toBeTruthy();
  });

  test('refs accept composed computed references', async () => {
    await page.waitForSelector('[data-id="composed-computed"]');
    const element = await page.$('[data-id="composed-computed"]');
    expect(element).toBeTruthy();
  });

  test('refs accept logical computed references', async () => {
    await page.waitForSelector('[data-id="logical-computed"]');
    const element = await page.$('[data-id="logical-computed"]');
    expect(element).toBeTruthy();
  });

  test('refs accept literal computed references', async () => {
    await page.waitForSelector('[data-id="literal-computed"]');
    const element = await page.$('[data-id="literal-computed"]');
    expect(element).toBeTruthy();
  });

  test('refs functions receive an element as argument', async () => {
    await page.waitForSelector('[data-id="function"]');
    const element = await page.$('[data-id="function"]');
    expect(element).toBeTruthy();
  });

  test('refs functions only run after the element is appended do DOM', async () => {
    await page.waitForSelector('[data-dom]');
    const element = await page.$('[data-dom]');
    expect(element).toBeTruthy();
  });

  test('refs can be bubbled down', async () => {
    await page.waitForSelector('[data-id="bubble"]');
    const element = await page.$('[data-id="bubble"]');
    expect(element).toBeTruthy();
  });


});
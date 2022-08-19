describe('Refs', () => {

  beforeEach(async () => {
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

  test('refs functions receive attributes as argument', async () => {
    await page.waitForSelector('[data-ref-received-props]');
    const element = await page.$('[data-ref-received-props]');
    expect(element).toBeTruthy();
  });


  test('refs functions only run after the element is appended do DOM', async () => {
    await page.waitForSelector('[data-dom="0"]');
    const element = await page.$('[data-dom="0"]');
    expect(element).toBeTruthy();
  });

  test('refs can be bubbled down', async () => {
    await page.waitForSelector('[data-id="bubble"]');
    const element = await page.$('[data-id="bubble"]');
    expect(element).toBeTruthy();
  });

  test('refs functions run when the ref object changes', async () => {
    await page.waitForSelector('[data-dom="0"]');
    await page.click("button")
    await page.waitForSelector('[data-dom="1"]');
    const element = await page.$('[data-dom="1"]');
    expect(element).toBeTruthy();
  });

  test('refs are reassigned when the ref object changes ', async () => {
    await page.waitForSelector('[data-dom="0"]');
    await page.click("button")
    await page.waitForSelector('[data-id="hydrate-element"][data-instance="1"]');
    const element = await page.$('[data-id="hydrate-element"][data-instance="1"]');
    expect(element).toBeTruthy();
  });

});
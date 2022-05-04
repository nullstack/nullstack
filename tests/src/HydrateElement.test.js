describe('FullStackLifecycle ssr', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/');
    await page.click('[href="/hydrate-element"]')
  });

  test('prepare should run', async () => {
    await page.waitForSelector('[data-id="hydrate-element"]');
    const element = await page.$('[data-id="hydrate-element"]');
    expect(element).toBeTruthy();
  });


});
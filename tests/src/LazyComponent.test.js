beforeAll(async () => {
  page = await browser.newPage();
  await page.goto('http://localhost:6969/lazy-component');
});

describe('LazyComponent', () => {

  test('components can be lazy loaded', async () => {
    await page.waitForSelector('[data-lazy]');
    const element = await page.$('[data-lazy]');
    expect(element).toBeTruthy();
  });

});
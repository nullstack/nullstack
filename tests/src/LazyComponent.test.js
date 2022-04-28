beforeAll(async () => {
  await page.goto('http://localhost:6969/lazy-component');
});

describe('LazyComponent', () => {

  test('components can be lazy loaded', async () => {
    await page.waitForSelector('[data-lazy]');
    const element = await page.$('[data-lazy]');
    expect(element).toBeTruthy();
  });

  test('lazy components need to be safelisted in order to call server functions', async () => {
    await page.waitForSelector('[data-safelisted]');
    const element = await page.$('[data-safelisted]');
    expect(element).toBeTruthy();
  });

});
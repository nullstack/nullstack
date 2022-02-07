beforeAll(async () => {
  await page.goto('http://localhost:6969/component-ternary');
});

describe('ComponentTernary', () => {

  test('Component A should be visible by default', async () => {
    const element = await page.$('[data-a]');
    expect(element).toBeTruthy();
  });

  test('Component B should be visible when toggling the ternary', async () => {
    await page.click('button')
    await page.waitForSelector('[data-b]');
    const element = await page.$('[data-b]');
    expect(element).toBeTruthy();
  });

  test('Component A should be visible when toggling the ternary', async () => {
    await page.click('button')
    await page.waitForSelector('[data-a]');
    const element = await page.$('[data-a]');
    expect(element).toBeTruthy();
  });

});
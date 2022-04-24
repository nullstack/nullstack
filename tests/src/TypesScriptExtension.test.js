beforeAll(async () => {
  await page.goto('http://localhost:6969/typescript-extension');
});

describe('TypeScriptExtension', () => {

  test('components can use the tsx extension', async () => {
    await page.waitForSelector('[data-generic]');
    const element = await page.$('[data-generic]');
    expect(element).toBeTruthy();
  });

  test('class components accept generics', async () => {
    await page.waitForSelector('[data-generic]');
    const element = await page.$('[data-generic]');
    expect(element).toBeTruthy();
  });

});
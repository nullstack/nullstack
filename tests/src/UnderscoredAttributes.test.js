beforeAll(async () => {
  await page.goto('http://localhost:6969/underscored-attributes');
});

describe('UnderscoredAttributes', () => {

  test('functions with underscore do not receive the context as argument', async () => {
    await page.waitForSelector('[data-a="1"]');
    const element = await page.$('[data-a="1"]');
    expect(element).toBeTruthy();
  });

  test('methods with underscore are bound to the proxy', async () => {
    await page.waitForSelector('[data-a="1"]');
    const element = await page.$('[data-a="1"]');
    expect(element).toBeTruthy();
  });

  test('functions assigned to underscored attributes are bound to the proxy', async () => {
    const element = await page.$('[data-b="1"]');
    expect(element).toBeTruthy();
  });

  test('assigning a function to an underscored attribute binds after the constructor is run', async () => {
    const element = await page.$('[data-c="1"]');
    expect(element).toBeTruthy();
  });

  test('objects assigned to underscored attributes do not become proxies', async () => {
    const element = await page.$('[data-d="0"]');
    expect(element).toBeTruthy();
  });

  test('keys assigned with a function that name is underscored do not receive the context as argument', async () => {
    const element = await page.$('[data-e="1"]');
    expect(element).toBeTruthy();
  });

});
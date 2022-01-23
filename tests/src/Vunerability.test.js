beforeAll(async () => {
  page = await context.newPage();
  await page.goto('http://localhost:6969/vunerability');
});

describe('ContextPage', () => {

  test('html is sanitized when used as node', async () => {
    const element = await page.$('[data-secure]');
    expect(element).toBeTruthy();
  });

  test('html is not sanitized when used as tag', async () => {
    await page.waitForSelector('b');
    const element = await page.$('b');
    expect(element).toBeTruthy();
  });

  test('script tags are sanitized when used as tag', async () => {
    await page.waitForSelector('b script');
    const element = await page.$('[data-secure]');
    expect(element).toBeTruthy();
  });

});
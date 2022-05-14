describe('Application', () => {

  test('the application is running', async () => {
    const response = await page.goto('http://localhost:6969');
    const status = response.status();
    expect(status).toBe(200);
  });

  test('the static start function runs on startup', async () => {
    const h1 = await page.$('h1');
    const text = await page.evaluate(element => element.textContent, h1);
    expect(text).toMatch('Nullstack Tests');
  });

  test('a stylesheet is generated if css is imported', async () => {
    const element = await page.$('[rel="stylesheet"]');
    expect(element).toBeTruthy();
  });

  test('simple scripts depending on window should be importable on server', async () => {
    const element = await page.$('[data-window="shim"]');
    expect(element).toBeTruthy();
  });

});
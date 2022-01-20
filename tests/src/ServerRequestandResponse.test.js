const browser = context;

beforeAll(async () => {
  page = await browser.newPage();
  await page.goto('http://localhost:6969/server-request-and-response');
});

describe('ServerRequestAndResponse', () => {

  test('the port key makes server run in the defined port', async () => {
    const response = await page.goto('http://localhost:6969');
    const status = response.status();
    expect([200, 304]).toContain(status);
  });

  test('server accepts use of middlewares', async () => {
    const response = await page.goto('http://localhost:6969/api');
    const status = response.status();
    expect([200, 304]).toContain(status);
  });

  test('server accepts GET routes', async () => {
    const element = await page.$('[data-get]');
    expect(element).toBeFalsy();
  });

  test('server accepts DELETE routes', async () => {
    const element = await page.$('[data-delete]');
    expect(element).toBeFalsy();
  });

  test('server accepts GET routes', async () => {
    const element = await page.$('[data-get]');
    expect(element).toBeFalsy();
  });

  test('server accepts HEAD routes', async () => {
    const element = await page.$('[data-head]');
    expect(element).toBeFalsy();
  });

  test('server accepts OPTIONS routes', async () => {
    const element = await page.$('[data-options]');
    expect(element).toBeFalsy();
  });

  test('server accepts PATCH routes', async () => {
    const element = await page.$('[data-patch]');
    expect(element).toBeFalsy();
  });

  test('server accepts POST routes', async () => {
    const element = await page.$('[data-post]');
    expect(element).toBeFalsy();
  });

  test('server accepts PUT routes', async () => {
    const element = await page.$('[data-put]');
    expect(element).toBeFalsy();
  });

});
beforeAll(async () => {
  await page.goto('http://localhost:6969/polyfill');
});

describe('Polyfill', () => {

  test('client has a polyfill for node buffer global', async () => {
    await page.waitForSelector('[data-buffer-global="nullstack"]');
    const element = await page.$('[data-buffer-global="nullstack"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node buffer', async () => {
    await page.waitForSelector('[data-buffer="object"]');
    const element = await page.$('[data-buffer="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node assert', async () => {
    await page.waitForSelector('[data-assert="function"]');
    const element = await page.$('[data-assert="function"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node constants', async () => {
    await page.waitForSelector('[data-constants="object"]');
    const element = await page.$('[data-constants="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node crypto', async () => {
    await page.waitForSelector('[data-crypto="object"]');
    const element = await page.$('[data-crypto="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node domain', async () => {
    await page.waitForSelector('[data-domain="object"]');
    const element = await page.$('[data-domain="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node events', async () => {
    await page.waitForSelector('[data-events="function"]');
    const element = await page.$('[data-events="function"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node http', async () => {
    await page.waitForSelector('[data-http="object"]');
    const element = await page.$('[data-http="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node https', async () => {
    await page.waitForSelector('[data-https="object"]');
    const element = await page.$('[data-https="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node os', async () => {
    await page.waitForSelector('[data-os="object"]');
    const element = await page.$('[data-os="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node path', async () => {
    await page.waitForSelector('[data-path="object"]');
    const element = await page.$('[data-path="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node punycode', async () => {
    await page.waitForSelector('[data-punycode="object"]');
    const element = await page.$('[data-punycode="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node process', async () => {
    await page.waitForSelector('[data-process="object"]');
    const element = await page.$('[data-process="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node querystring', async () => {
    await page.waitForSelector('[data-querystring="object"]');
    const element = await page.$('[data-querystring="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node stream', async () => {
    await page.waitForSelector('[data-stream="function"]');
    const element = await page.$('[data-stream="function"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node string_decoder', async () => {
    await page.waitForSelector('[data-string-decoder="object"]');
    const element = await page.$('[data-string-decoder="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node sys', async () => {
    await page.waitForSelector('[data-sys="object"]');
    const element = await page.$('[data-sys="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node timers', async () => {
    await page.waitForSelector('[data-timers="object"]');
    const element = await page.$('[data-timers="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node tty', async () => {
    await page.waitForSelector('[data-tty="object"]');
    const element = await page.$('[data-tty="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node url', async () => {
    await page.waitForSelector('[data-url="object"]');
    const element = await page.$('[data-url="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node url', async () => {
    await page.waitForSelector('[data-url="object"]');
    const element = await page.$('[data-url="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node util', async () => {
    await page.waitForSelector('[data-util="object"]');
    const element = await page.$('[data-util="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node vm', async () => {
    await page.waitForSelector('[data-vm="object"]');
    const element = await page.$('[data-vm="object"]');
    expect(element).toBeTruthy();
  });

  test('client has a polyfill for node zlib', async () => {
    await page.waitForSelector('[data-zlib="object"]');
    const element = await page.$('[data-zlib="object"]');
    expect(element).toBeTruthy();
  });

});
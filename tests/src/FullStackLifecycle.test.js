describe('FullStackLifecycle ssr', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/full-stack-lifecycle');
  });

  test('prepare should run', async () => {
    await page.waitForSelector('[data-prepared]');
    const element = await page.$('[data-prepared]');
    expect(element).toBeTruthy();
  });

  test('prepare should run in the server for ssr', async () => {
    await page.waitForSelector('[data-prepare-env="server"]');
    const element = await page.$('[data-prepare-env="server"]');
    expect(element).toBeTruthy();
  });

  test('initiate should run', async () => {
    await page.waitForSelector('[data-initiated]');
    const element = await page.$('[data-initiated]');
    expect(element).toBeTruthy();
  });

  test('initiate should run in the server for ssr', async () => {
    await page.waitForSelector('[data-initiate-env="server"]');
    const element = await page.$('[data-initiate-env="server"]');
    expect(element).toBeTruthy();
  });

  test('launch should run', async () => {
    await page.waitForSelector('[data-launched]');
    const element = await page.$('[data-launched]');
    expect(element).toBeTruthy();
  });

  test('launch should run in the server for ssr', async () => {
    await page.waitForSelector('[data-launch-env="server"]');
    const element = await page.$('[data-launch-env="server"]');
    expect(element).toBeTruthy();
  });

  test('hydrate should run', async () => {
    await page.waitForSelector('[data-hydrated]');
    const element = await page.$('[data-hydrated]');
    expect(element).toBeTruthy();
  });

  test('update should run', async () => {
    await page.waitForSelector('[data-updated]');
    const element = await page.$('[data-updated]');
    expect(element).toBeTruthy();
  });

  test('terminate should run', async () => {
    await page.click('a[href="/"]');
    await page.waitForFunction(() => location.search === '?terminated=true');
    const element = await page.$('.FullStackLifecycle');
    expect(element).toBeFalsy();
  });

});

describe('FullStackLifecycle spa', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/');
    await page.click('a[href="/full-stack-lifecycle"]')
  });

  test('prepare should run', async () => {
    await page.waitForSelector('[data-prepared]');
    const element = await page.$('[data-prepared]');
    expect(element).toBeTruthy();
  });

  test('prepare should run in the client for spa', async () => {
    await page.waitForSelector('[data-prepare-env="client"]');
    const element = await page.$('[data-prepare-env="client"]');
    expect(element).toBeTruthy();
  });

  test('initiate should run', async () => {
    await page.waitForSelector('[data-initiated]');
    const element = await page.$('[data-initiated]');
    expect(element).toBeTruthy();
  });

  test('initiate should run in the client for spa', async () => {
    await page.waitForSelector('[data-initiate-env="client"]');
    const element = await page.$('[data-initiate-env="client"]');
    expect(element).toBeTruthy();
  });

  test('launch should run', async () => {
    await page.waitForSelector('[data-launched]');
    const element = await page.$('[data-launched]');
    expect(element).toBeTruthy();
  });

  test('launch should run in the client for spa', async () => {
    await page.waitForSelector('[data-launch-env="client"]');
    const element = await page.$('[data-launch-env="client"]');
    expect(element).toBeTruthy();
  });

  test('hydrate should run', async () => {
    await page.waitForSelector('[data-hydrated]');
    const element = await page.$('[data-hydrated]');
    expect(element).toBeTruthy();
  });

  test('update should run', async () => {
    await page.waitForSelector('[data-updated]');
    const element = await page.$('[data-updated]');
    expect(element).toBeTruthy();
  });

  test('terminate should run', async () => {
    await page.click('a[href="/"]');
    await page.waitForFunction(() => location.search === '?terminated=true');
    const element = await page.$('.FullStackLifecycle');
    expect(element).toBeFalsy();
  });

});
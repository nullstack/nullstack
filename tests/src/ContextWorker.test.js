const browser = context;

describe('ContextWorker', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/context-worker');
  });

  test('queues keys always return at least an empty array', async () => {
    const element = await page.$('[data-queues-length="0"]');
    expect(element).toBeTruthy();
  });

  test('fetching is set to false when the worker is idle', async () => {
    const element = await page.$('[data-fetching]');
    expect(element).toBeFalsy();
  });

  test('has a cdn key', async () => {
    const element = await page.$('[data-cdn="http://127.0.0.1:6969"]');
    expect(element).toBeTruthy();
  });

  test('is part of the client context', async () => {
    const element = await page.$('[data-worker]');
    expect(element).toBeTruthy();
  });

  test('has an enabled key', async () => {
    const element = await page.$('[data-enabled]');
    expect(element).toBeTruthy();
  });

  test('has an online key', async () => {
    const element = await page.$('[data-online]');
    expect(element).toBeTruthy();
  });

  test('has an responsive key', async () => {
    const element = await page.$('[data-responsive]');
    expect(element).toBeTruthy();
  });

  test('has an preload key', async () => {
    const element = await page.$('[data-preload]');
    expect(element).toBeTruthy();
  });

  test('preload accepts an array of paths', async () => {
    const element = await page.$('[data-preload-path="/context-worker"]');
    expect(element).toBeTruthy();
  });

  test('service worker registration is available as the registration key', async () => {
    await page.waitForSelector('[data-registration="ServiceWorkerRegistration"]');
    const element = await page.$('[data-registration="ServiceWorkerRegistration"]');
    expect(element).toBeTruthy();
  });

  test('headers can be customized', async () => {
    await page.waitForSelector('[data-header="custom"]');
    const element = await page.$('[data-header="custom"]');
    expect(element).toBeTruthy();
  });

  /* TODO - beforeinstallationprompt is not firing in puppeteer
  test('installation prompt is available as the installation key', async () => {
    await page.waitForSelector('[data-installation="BeforeInstallPromptEvent"]');
    const element = await page.$('[data-installation="BeforeInstallPromptEvent"]');
    expect(element).toBeTruthy();
  });
  */

});

describe('ContextWorker', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/context-worker');
  });

  test('fetching is set to true when the worker is fetching', async () => {
    await page.waitForTimeout(1000);
    await page.click('button');
    await page.waitForSelector('[data-fetching]');
    const element = await page.$('[data-fetching]');
    expect(element).toBeTruthy();
  });

});

describe('ContextWorker', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/context-worker');
  });

  test('fetching is set to the arguments of the server function when the worker is fetching', async () => {
    await page.click('#a');
    await page.waitForSelector('[data-queues="a"]');
    let element = await page.$('[data-queues="a"]');
    expect(element).toBeTruthy();

    element = await page.$('[data-queues-length="1"]');
    expect(element).toBeTruthy();

    await page.click('#b');
    await page.waitForSelector('[data-queues="a,b"]');
    element = await page.$('[data-queues="a,b"]');
    expect(element).toBeTruthy();

    element = await page.$('[data-queues-length="2"]');
    expect(element).toBeTruthy();

    await page.waitForTimeout(4000);
    element = await page.$('[data-queues="a,b"]');
    expect(element).toBeFalsy();

    element = await page.$('[data-queues-length="0"]');
    expect(element).toBeTruthy();
  });

});
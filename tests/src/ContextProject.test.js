const puppeteer = require('puppeteer');

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

describe('ContextProject', () => {
  
  let page;

  beforeAll(async () => {
    page = await browser.newPage();
  });

  test('cors can be enabled', async () => {
    const response = await page.goto('http://localhost:6969/context-project');
    const status = response.status();
    expect([200, 304]).toContain(status);
  });

});

describe('ContextProject', () => {
  
  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/context-project');
    await page.waitForSelector('[data-project]');
  });

  test('project is part of the context', async () => {
    const element = await page.$('[data-project]');
    expect(element).toBeTruthy();
  });

  test('has a name key', async () => {
    const element = await page.$('[data-name="Nullstack Tests"]');
    expect(element).toBeTruthy();
  });

  test('has a shortName key', async () => {
    const element = await page.$('[data-short-name="Nullstack"]');
    expect(element).toBeTruthy();
  });

  test('has a domain key', async () => {
    const element = await page.$('[data-domain="localhost"]');
    expect(element).toBeTruthy();
  });

  test('has a color key', async () => {
    const element = await page.$('[data-color="#d22365"]');
    expect(element).toBeTruthy();
  });

  test('has a cdn key', async () => {
    const element = await page.$('[data-cdn]');
    expect(element).toBeTruthy();
  });

  test('has a backgroundColor key', async () => {
    const element = await page.$('[data-background-color="#d22365"]');
    expect(element).toBeTruthy();
  });

  test('has a type key', async () => {
    const element = await page.$('[data-type="website"]');
    expect(element).toBeTruthy();
  });

  test('has a display key', async () => {
    const element = await page.$('[data-display="standalone"]');
    expect(element).toBeTruthy();
  });

  test('has an orientation key', async () => {
    const element = await page.$('[data-orientation="portrait"]');
    expect(element).toBeTruthy();
  });

  test('has a scope key', async () => {
    const element = await page.$('[data-scope="/"]');
    expect(element).toBeTruthy();
  });

  test('has a root key', async () => {
    const element = await page.$('[data-root="/"]');
    expect(element).toBeTruthy();
  });

  test('has an icons key', async () => {
    const element = await page.$('[data-icons]');
    expect(element).toBeTruthy();
  });

  test('icons accepts an object with sizes', async () => {
    const element = await page.$('[data-icon-72="/icon-72x72.png"]');
    expect(element).toBeTruthy();
  });

  test('has a favicon key', async () => {
    const element = await page.$('[data-favicon="/favicon-96x96.png"]');
    expect(element).toBeTruthy();
  });

  test('has a disallow key', async () => {
    const element = await page.$('[data-disallow]');
    expect(element).toBeTruthy();
  });

  test('disallow accepts an array with paths', async () => {
    const element = await page.$('[data-disallow-admin="/admin"]');
    expect(element).toBeTruthy();
  });

  test('has a sitemap key', async () => {
    const element = await page.$('[data-sitemap]');
    expect(element).toBeTruthy();
  });

  test('css bundle can use a cdn', async () => {
    const text = await page.$eval('[rel="stylesheet"]', (element) => element.href);
    expect(text).toMatch(/localhost:6969/);
  });

  test('javacript bundle can use a cdn', async () => {
    const text = await page.$eval('script[integrity]', (element) => element.src);
    expect(text).toMatch(/localhost:6969/);
  });

  test('css bundle has an empty integrity in dev mode', async () => {
    const text = await page.$eval('[rel="stylesheet"]', (element) => element.integrity);
    expect(text).toMatch('');
  });

  test('javacript bundle has an empty integrity in dev mode', async () => {
    const text = await page.$eval('script[integrity]', (element) => element.integrity);
    expect(text).toMatch('');
  });

  test('manifest has an empty integrity in dev mode', async () => {
    const text = await page.$eval('[rel="manifest"]', (element) => element.integrity);
    expect(text).toMatch('');
  });


});

describe('robots.txt', () => {
  
  let page;
  let text;
  
  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/robots.txt');
    text = await page.evaluate(() => document.body.innerHTML);
  });

  test('it generates a robot.txt', async () => {
    const index = text.indexOf('User-Agent: *')
    expect(index).toBeGreaterThan(-1);
  });

  test('it allows project.root', async () => {
    const index = text.indexOf('Allow: /')
    expect(index).toBeGreaterThan(-1);
  });

  test('it reflects project.disallow', async () => {
    const index = text.indexOf('Disallow: /admin')
    expect(index).toBeGreaterThan(-1);
  });

  test('it reflects project.sitemap', async () => {
    const index = text.indexOf('Sitemap: http://localhost:6969/sitemap.xml')
    expect(index).toBeGreaterThan(-1);
  });

});

afterAll(async () => {
  browser.close();
});
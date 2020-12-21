const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/context-data');
});

describe('ContextEnvironment', () => {

  test('is part of the client context', async () => {
    const element = await page.$('[data-data]');
    expect(element).toBeTruthy();
  });

  test('data attributs can be mixed with data-key', async () => {
    await page.click('button');
    await page.waitForSelector('[data-count="5"]');
    const element = await page.$('[data-count="5"]');
    expect(element).toBeTruthy();
  });

  test('data attribuets are camelized into data key', async () => {
    const element = await page.$('[data-framework-name="Nullstack"]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/lazy-component');
});

describe('LazyComponent', () => {

  test('components can be lazy loaded', async () => {
    await page.waitForSelector('[data-lazy]');
    const element = await page.$('[data-lazy]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
const puppeteer = require('puppeteer');

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

describe('StaticThis ssr', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/static-this');
  });

  test('this is bound to the class in server functions', async () => {
    const element = await page.$('[data-name="StaticThis"]');
    expect(element).toBeTruthy();  
  });

});

describe('StaticThis spa', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/');
    await page.click('[href="/static-this"]');
  });

  test('this is bound to the class in server functions', async () => {
    await page.waitForSelector('[data-name="StaticThis"]');
    const element = await page.$('[data-name="StaticThis"]');
    expect(element).toBeTruthy();  
  });

});


afterAll(async () => {
  browser.close();
});
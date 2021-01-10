const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
    await page.goto('http://localhost:6969/static-rendering');
});

describe('StaticRendering', () => {

  test('render only components are optimized into static functions', async () => {
    const element = await page.$('[render-name="StaticRendering"]');
    expect(element).toBeTruthy();
  });
  
  test('render only inner components are optimized into static functions', async () => {
    const element = await page.$('[render-name="StaticRendering"]');
    expect(element).toBeTruthy();
  });

  test('render only nested inner components are optimized into static functions', async () => {
    const element = await page.$('[render-inner-inner-name="StaticRendering"]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
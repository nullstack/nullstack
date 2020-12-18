const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/context-loading');
});

describe('ContextLoading', () => {

  test('is part of the client environment', async () => {
    const element = await page.$('[data-loading]');
    expect(element).toBeTruthy();
  });

  test('has false keys by default', async () => {
    const element = await page.$('[data-loading-function]');
    expect(element).toBeFalsy();
  });

  test('sets a key with the function name to true before it requests', async () => {
    await page.click('button');
    await page.waitForSelector('[data-loading-function]');
    const element = await page.$('[data-loading-function]');
    expect(element).toBeTruthy();
  });

  test('removes the key with the function name after it requests', async () => {
    await page.click('button');
    await page.waitForTimeout(1500);
    const element = await page.$('[data-loading-function]');
    expect(element).toBeFalsy();
  });

});

afterAll(async () => {
  browser.close();
});
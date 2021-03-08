const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/element');
});

describe('FullStackLifecycle', () => {

  test('elements can receive any tag b', async () => {
    const element = await page.$('b[data-tag="b"]');
    expect(element).toBeTruthy();
  });

  test('elements can receive any tag abbr', async () => {
    const element = await page.$('abbr[data-tag="abbr"]');
    expect(element).toBeTruthy();
  });

  test('elements without tag become fragments', async () => {
    const element = await page.$('[data-tag="fragment"]');
    expect(element).toBeFalsy();
  });

});

afterAll(async () => {
  browser.close();
});
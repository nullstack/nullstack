const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/remove-start');
});

describe('RemoveStart', () => {
    
  test('static functions with named started with start folowed by uppercase letter are removed from client', async () => {
    await page.waitForSelector('[data-start-removed-from-client]');
    const element = await page.$('[data-start-removed-from-client]');
    expect(element).toBeTruthy();
  });

  test('static functions with named started with start not folowed by uppercase letter are not removed from client', async () => {
    await page.waitForSelector('[data-startup-not-removed-from-client]');
    const element = await page.$('[data-startup-not-removed-from-client]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
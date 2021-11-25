const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/isomorphic-startup');
});

describe('RemoveStart', () => {

  test('the client context can be updated at start', async () => {
    await page.waitForSelector('[data-client-start-value]');
    const element = await page.$('[data-client-start-value]');
    expect(element).toBeTruthy();
  });

  test('the client context is reactive at start', async () => {
    await page.waitForSelector('[data-client-start-timed-value]');
    const element = await page.$('[data-client-start-timed-value]');
    expect(element).toBeTruthy();
  });

  test('the server context can be updated at start', async () => {
    await page.waitForSelector('[data-server-start-value]');
    const element = await page.$('[data-server-start-value]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
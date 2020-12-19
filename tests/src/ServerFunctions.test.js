const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/server-functions');
});

describe('ServerFunctions', () => {
  
  test('instance can use returned values', async () => {
    await page.click('.set-count-to-one');
    await page.waitForSelector('[data-count="1"]');
    const element = await page.$('[data-count="1"]');
    expect(element).toBeTruthy();
  });

  test('server functions accept an object as argument', async () => {
    await page.click('.set-count-to-two');
    await page.waitForSelector('[data-count="2"]');
    const element = await page.$('[data-count="2"]');
    expect(element).toBeTruthy();
  });

  test('server functions serialize and deserialize dates', async () => {
    await page.click('.set-date');
    await page.waitForSelector('[data-year="1992"]');
    const element = await page.$('[data-year="1992"]');
    expect(element).toBeTruthy();
  });

  test('server functions have access to node.js environment', async () => {
    await page.waitForSelector(`[data-statement="import Nullstack from 'nullstack';"]`);
    const element = await page.$(`[data-statement="import Nullstack from 'nullstack';"]`);
    expect(element).toBeTruthy();
  });

  test('server functions have access to fetch', async () => {
    await page.waitForSelector(`[data-response="User-Agent: *"]`);
    const element = await page.$(`[data-response="User-Agent: *"]`);
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
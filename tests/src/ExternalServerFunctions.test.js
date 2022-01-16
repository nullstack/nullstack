const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/external-server-functions');
});

describe('ExtermalServerFunctions', () => {

  test('server functions can be invoked from the instance on client', async () => {
    await page.waitForSelector('[data-client-method]');
    const element = await page.$('[data-client-method]');
    expect(element).toBeTruthy();
  });

  test('server functions can be invoked from the constructor constant on client', async () => {
    await page.waitForSelector('[data-client-static]');
    const element = await page.$('[data-client-static]');
    expect(element).toBeTruthy();
  });

  test('server functions can be invoked from the instance on server', async () => {
    await page.waitForSelector('[data-server-method]');
    const element = await page.$('[data-server-method]');
    expect(element).toBeTruthy();
  });

  test('server functions can be invoked from the constructor constant on server', async () => {
    await page.waitForSelector('[data-server-static]');
    const element = await page.$('[data-server-static]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
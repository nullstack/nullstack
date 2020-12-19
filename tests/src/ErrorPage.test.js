const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});

describe('ErrorPage', () => {

  test('pages with error have a 500 status', async () => {
    const response = await page.goto('http://localhost:6969/error-page?status=500');
    const status = response.status();
    expect(status).toBe(500);
  });

  test('pages with error have a status key with the value 500', async () => {
    const element = await page.$('[data-page-status="500"]');
    expect(element).toBeTruthy();
  });

  test('pages with status 404 have a 404 status', async () => {
    const response = await page.goto('http://localhost:6969/error-page');
    const status = response.status();
    expect(status).toBe(404);
  });

  test('pages status reflects on the client context', async () => {
    const element = await page.$('[data-page-status="404"]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
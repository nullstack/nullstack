const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
});

test('the application is running', async () => {
  await page.goto('http://localhost:5000');
  const h1 = await page.$('h1');
  const text = await page.evaluate(element => element.innerText, h1);
  expect(text).toMatch('Nullstack Tests');
});

afterAll(async () => {
  browser.close();
});
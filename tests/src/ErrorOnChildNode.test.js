const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/error-on-child-node');
});

describe('Error when ChildNode is undefined', () => {

  test('Should be able to click on button', async () => {
    await page.click('[id=buttonTest]');
    await page.waitForSelector('[id=text]');
    const text = await page.$eval('[id=text]', element => element.textContent);
    expect(text).toMatch('Changed Value');
  });
  
})

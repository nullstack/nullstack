const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/instance-key');
  await page.click('.increment-by-two');
  await page.waitForSelector('[data-count="3"]');
});

describe('InstanceKey', () => {

  test('components can share the same instance', async () => {
    const elements = await page.$$('[data-count="3"]');
    expect(elements.length).toBe(2);
  });

  test('moving a component with a key will keep its instance alive', async () => {
    await page.click('.move-component');
    await page.waitForTimeout(500);
    const elements = await page.$$('[data-count="3"]');
    expect(elements.length).toBe(2);
  });

  test('shared instances only run the lifecycle once', async () => {
    const element = await page.$('[data-prepared="1"]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
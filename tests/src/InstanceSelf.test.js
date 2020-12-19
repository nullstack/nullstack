const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/instance-self');
});

describe('InstanceSelf', () => {

  test('self is aware that the component initiated', async () => {
    await page.waitForSelector('[data-initiated]');
    const element = await page.$('[data-initiated]');
    expect(element).toBeTruthy();
  });

  test('self is aware that the component is hydrated', async () => {
    await page.waitForSelector('[data-hydrated]');
    const element = await page.$('[data-hydrated]');
    expect(element).toBeTruthy();
  });

  test('self is aware that the component was prerendered', async () => {
    await page.waitForSelector('[data-prerendered]');
    const element = await page.$('[data-prerendered]');
    expect(element).toBeTruthy();
  });

  test('self is aware of the component element', async () => {
    await page.waitForSelector('[data-class-name="InstanceSelf"]');
    const element = await page.$('[data-class-name="InstanceSelf"]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
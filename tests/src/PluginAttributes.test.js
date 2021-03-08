const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/plugin-attributes');
});

describe('PluginAttributes', () => {

  test('Added plugin renders v-html in element', async () => {
    const element = await page.$('[data-vue]');
    const html = await (await element.getProperty('innerHTML')).jsonValue();
    expect(html).toMatch('<b>Nullstack</b>');
  });

  test('Added plugin uses v-if to toggle element', async () => {
    await page.click('button');
    await page.waitForSelector('[data-btn="true"]');
    let headings = await page.$$('h1');
    expect(headings.length).toBe(1);

    await page.click('button');
    await page.waitForSelector('[data-btn="false"]');
    headings = await page.$$('h1');
    expect(headings.length).toBe(2);
  });

});

afterAll(async () => {
  browser.close();
});
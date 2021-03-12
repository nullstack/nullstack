const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/plugin-attributes');
});

describe('PluginAttributes', () => {

  const toogleElement = async (showTitle, len) => {
    await page.click('button');
    await page.waitForSelector(`[data-btn="${showTitle}"]`);
    headings = await page.$$('h1');

    expect(headings.length).toBe(len);
  };

  test('Added plugin renders v-html in element', async () => {
    const element = await page.$('[data-vue]');
    const html = await page.evaluate(element => element.innerHTML, element);

    expect(html).toMatch('<b>Nullstack</b>');
  });

  test('Added plugin uses v-if to toggle element', async () => {
    await toogleElement(true, 1);

    await toogleElement(false, 2);
  });

});

afterAll(async () => {
  browser.close();
});
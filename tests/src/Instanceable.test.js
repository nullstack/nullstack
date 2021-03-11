const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/instanceable');
});

describe('Instanceable', () => {

  const testCycle = async (title, value) => {
    const selector = `[data-title="${title}"]`;
    await page.waitForSelector(selector);
    const p = await page.$(selector);
    const text = await page.evaluate(element => element.innerText, p);

    const expectedValue = new Array(2).fill(value).join(' ');
    expect(text).toBe(expectedValue);
  }

  test('server lifecycle can change instance', async () => {
    await testCycle('prepare', 'Prepared!');
  });

  test('client lifecycle can change instance', async () => {
    await testCycle('hydrate', 'Hydrated!');
  });

  test("instance can use foreign methods which calls it's back", async () => {
    await page.click('[data-change-instanceable="false"]');
    await page.waitForSelector('[data-change-instanceable="true"]');
    await testCycle('title', 'Nullstack!');
  });

});

afterAll(async () => {
  browser.close();
});
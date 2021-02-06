const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/child-component');
});

describe('ChildComponent', () => {

  test('Nullstack is auto imported when using inheritance', async () => {
    const element = await page.$('[data-current="ChildComponent"]');
    expect(element).toBeTruthy();
  });

  test('inner components are overridable', async () => {
    const element = await page.$('[data-current="ChildComponent"]');
    expect(element).toBeTruthy();
  });

  test('server functions are bound to the class in ssr', async () => {
    const element = await page.$('[data-child-this="ChildComponent"]');
    expect(element).toBeTruthy();
  });

  test('inherited server functions are bound to the class ssr' , async () => {
    const element = await page.$('[data-parent-this="ChildComponent"]');
    expect(element).toBeTruthy();
  });

  test('server functions are bound to the class in spa', async () => {
    const element = await page.$('[data-hydrated-child-this="ChildComponent"]');
    expect(element).toBeTruthy();
  });

  test('inherited server functions are bound to the class spa' , async () => {
    const element = await page.$('[data-hydrated-parent-this="ChildComponent"]');
    expect(element).toBeTruthy();
  });


});

afterAll(async () => {
  browser.close();
});
const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/pure-components?works=true');
});

describe('RemoveStart', () => {
    
  test('anonymous functions can be components with context', async () => {
    await page.waitForSelector('[data-anon]');
    const element = await page.$('[data-anon]');
    expect(element).toBeTruthy();
  });

  test('anonymous functions can be components with attributes', async () => {
    await page.waitForSelector('#anon');
    const element = await page.$('#anon');
    expect(element).toBeTruthy();
  });

  test('named functions can be components with context', async () => {
    await page.waitForSelector('[data-named]');
    const element = await page.$('[data-named]');
    expect(element).toBeTruthy();
  });

  test('named functions can be components with attributes', async () => {
    await page.waitForSelector('#named');
    const element = await page.$('#named');
    expect(element).toBeTruthy();
  });

  test('arrow functions can be components with context', async () => {
    await page.waitForSelector('[data-arrow]');
    const element = await page.$('[data-arrow]');
    expect(element).toBeTruthy();
  });

  test('arrow functions can be components with attributes', async () => {
    await page.waitForSelector('#arrow');
    const element = await page.$('#arrow');
    expect(element).toBeTruthy();
  });

  test('inner functions can be components with context', async () => {
    await page.waitForSelector('[data-inner]');
    const element = await page.$('[data-inner]');
    expect(element).toBeTruthy();
  });

  test('inner functions can be components with attributes', async () => {
    await page.waitForSelector('#inner');
    const element = await page.$('#inner');
    expect(element).toBeTruthy();
  });

  test('pure components receive a proxy to the context', async () => {
    await page.focus('input')
    await page.keyboard.type('!')
    await page.waitForSelector('[data-string="!nullstack"]');
    const element = await page.$('[data-string="!nullstack"]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
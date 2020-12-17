const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:5000/context-environment');
});

describe('ContextEnvironment', () => {

  test('is part of the client context', async () => {
    const element = await page.$('[data-environment]');
    expect(element).toBeTruthy();
  });

  test('has a client key', async () => {
    const element = await page.$('[data-client="true"]');
    expect(element).toBeTruthy();
  });

  test('has a server key', async () => {
    const element = await page.$('[data-server="false"]');
    expect(element).toBeTruthy();
  });

  test('has a development key', async () => {
    const element = await page.$('[data-development="true"]');
    expect(element).toBeTruthy();
  });

  test('has a production key', async () => {
    const element = await page.$('[data-production="false"]');
    expect(element).toBeTruthy();
  });

  test('has a static key', async () => {
    const element = await page.$('[data-static="false"]');
    expect(element).toBeTruthy();
  });

  test('has a key with the environment hash', async () => {
    const element = await page.$('[data-key]');
    expect(element).toBeTruthy();
  });

});

afterAll(async () => {
  browser.close();
});
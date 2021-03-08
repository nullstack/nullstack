const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/context-settings');
});

describe('ContextSettings', () => {

  test('settings are exposed to the client context', async () => {
    const element = await page.$('[data-settings]');
    expect(element).toBeTruthy();
  });

  test('keys starting with NULLSTACK_SETTINGS_ are read from the environment', async () => {
    const element = await page.$('[data-key="settings"]');
    expect(element).toBeTruthy();
  });

  test('environment keys are camelized', async () => {
    const element = await page.$('[data-camelized-key="settings"]');
    expect(element).toBeTruthy();
  });

  test('keys assigned to settings stay in the context of development and production environments', async () => {
    const element = await page.$('[data-any-environment="settings"]');
    expect(element).toBeTruthy();
  });

  test('keys assigned to development stay only in the context of the development environment', async () => {
    const element = await page.$('[data-development-only="settings"]');
    expect(element).toBeTruthy();
  });

  test('keys assigned to production stay only in the context of the production environment', async () => {
    const element = await page.$('[data-production-only="settings"]');
    expect(element).toBeFalsy();
  });

});

afterAll(async () => {
  browser.close();
});
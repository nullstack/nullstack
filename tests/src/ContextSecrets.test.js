const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:5000/context-secrets');
});

describe('ContextSecrets', () => {

  test('secrets are not exposed to the client context', async () => {
    const element = await page.$('[data-secrets]');
    expect(element).toBeFalsy();
  });

  test('keys starting with NULLSTACK_SECRETS_ are read from the environment', async () => {
    const element = await page.$('[data-key="secrets"]');
    expect(element).toBeTruthy();
  });

  test('environment keys are camelized', async () => {
    const element = await page.$('[data-camelized-key="secrets"]');
    expect(element).toBeTruthy();
  });

  test('keys assigned to secrets stay in the context of development and production environments', async () => {
    const element = await page.$('[data-any-environment="secrets"]');
    expect(element).toBeTruthy();
  });

  test('keys assigned to development stay only in the context of the development environment', async () => {
    const element = await page.$('[data-development-only="secrets"]');
    expect(element).toBeTruthy();
  });

  test('keys assigned to production stay only in the context of the production environment', async () => {
    const element = await page.$('[data-production-only="secrets"]');
    expect(element).toBeFalsy();
  });

});

afterAll(async () => {
  browser.close();
});
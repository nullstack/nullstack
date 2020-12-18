const puppeteer = require('puppeteer');

let browser;

beforeAll(async () => {
  browser = await puppeteer.launch();
});

describe('RoutesAndParams /routes-and-params', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/routes-and-params');
  });

  test('is part of the client environment', async () => {
    const element = await page.$('[data-router]');
    expect(element).toBeTruthy();
  });

  test('routes match once per depth', async () => {
    const element = await page.$('[data-route="/routes-and-params"]');
    expect(element).toBeTruthy();
  });

  test('entering a route stops other routes on same depth', async () => {
    const element = await page.$('[data-other]');
    expect(element).toBeFalsy();  
  });

  test('params keys return empty keys by default', async () => {
    const element = await page.$('[data-empty]');
    expect(element).toBeTruthy();  
  });

  test('a tags can generate the href from params', async () => {
    const element = await page.$('[href="/routes-and-params?framework=nullstack"]');
    expect(element).toBeTruthy();  
  });

  test('assignments to params convert the value to JSON', async () => {
    await page.click('button');
    await page.waitForSelector('[data-date="1992-10-16T00:00:00.000Z"]');
    const element = await page.$('[data-date="1992-10-16T00:00:00.000Z"]');
    expect(element).toBeTruthy();  
  });

});

describe('RoutesAndParams /routes-and-params/a', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/routes-and-params');
    await page.click('[href="/routes-and-params/a"]');
    await page.waitForSelector('[data-a]');
  });

  test('a tags update the router url', async () => {
    const element = await page.$('[data-a]');
    expect(element).toBeTruthy();  
  });

  test('a custom event is triggered when the url changes', async () => {
    const element = await page.$('[data-event-triggered]');
    expect(element).toBeTruthy();  
  });

});

describe('RoutesAndParams /routes-and-params/?boolean=true', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/routes-and-params/?boolean=true');
  });

  test('params with value of true are converted to boolean', async () => {
    const element = await page.$('[data-boolean]');
    expect(element).toBeTruthy();  
  });

  test('a tags can assign directly to path', async () => {
    const element = await page.$('[href="/routes-and-params/d?boolean=true"]');
    expect(element).toBeTruthy();  
  });

  test('router url removes the leading slash', async () => {
    const element = await page.$('[data-url="/routes-and-params?boolean=true"]');
    expect(element).toBeTruthy();  
  });

  test('router path removes the leading slash', async () => {
    const element = await page.$('[data-path="/routes-and-params"]');
    expect(element).toBeTruthy();  
  });

});

describe('RoutesAndParams /routes-and-params?boolean=false', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/routes-and-params?boolean=false');
  });

  test('params with value of false are converted to boolean', async () => {
    const element = await page.$('[data-boolean]');
    expect(element).toBeFalsy();  
  });

});

describe('RoutesAndParams /routes-and-params/c', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/routes-and-params/c');
  });

  test('wildcards are matched last', async () => {
    const element = await page.$('[data-id="c"]');
    expect(element).toBeTruthy();  
  });

  test('dynamic segments are assigned to params', async () => {
    const element = await page.$('[data-id="c"]');
    expect(element).toBeTruthy();  
  });

});

describe('RoutesAndParams /routes-and-params/c', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/routes-and-params/c/a');
  });

  test('wildcards can be prefixed', async () => {
    const element = await page.$('[data-wildcard]');
    expect(element).toBeTruthy();  
  });

});

afterAll(async () => {
  browser.close();
});
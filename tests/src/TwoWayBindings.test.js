const puppeteer = require('puppeteer');

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost:6969/two-way-bindings?page=1');
});

describe('ContextPage', () => {

  test('bind adds a name attribute to the element', async () => {
    const element = await page.$('[name="number"]');
    expect(element).toBeTruthy();
  });

  test('source can be any object', async () => {
    const value = await page.$eval('[name="page"]', (element) => element.value);
    expect(value).toMatch('1');
  });

  test('source can be any object', async () => {
    const value = await page.$eval('[name="page"]', (element) => element.value);
    expect(value).toMatch('1');
  });

  test('textareas can be bound', async () => {
    const value = await page.$eval('[name="text"]', (element) => element.value);
    expect(value).toMatch('aaaa');
  });

  test('selects can be bound', async () => {
    const value = await page.$eval('[name="character"]', (element) => element.value);
    expect(value).toMatch('a');
  });

  test('checkboxes can be bound', async () => {
    const value = await page.$eval('[name="boolean"]', (element) => element.checked);
    expect(value).toBeTruthy();
  });

  test('objects can be the source of bind', async () => {
    const value = await page.$eval('[name="count"]', (element) => element.value);
    expect(value).toMatch('1');
  });

  test('array indexes can be the source of bind', async () => {
    const value = await page.$eval('[name="0"]', (element) => element.value);
    expect(value).toMatch('a');
  });

  test('custom inputs can be bound', async () => {
    const value = await page.$eval('[name="currency"]', (element) => element.value);
    expect(value).toMatch('100,00');
  });

  test('the name can be overwritten', async () => {
    const element = await page.$('[name="boolean-select"]');
    expect(element).toBeTruthy();
  });

  test('selects can bind to boolean attributes', async () => {
    await page.select('[name="boolean-select"]', 'false');
    await page.waitForSelector('[data-boolean-type="boolean"]');
    const element = await page.$('[data-boolean-type="boolean"]');
    expect(element).toBeTruthy();
  });

  test('inputs update the value of variables', async () => {
    await page.type('[name="number"]', '2');
    const value = await page.$eval('[name="number"]', (element) => element.value);
    expect(value).toMatch('2');
  });

  test('bind keeps the primitive type of the variable', async () => {
    await page.waitForSelector('[data-number-type="number"]');
    const element = await page.$('[data-number-type="number"]');
    expect(element).toBeTruthy();
  });

  test('bound inputs can have custom events that triger after the value is set', async () => {
    await page.waitForSelector('[data-character="b"]');
    const element = await page.$('[data-character="b"]');
    expect(element).toBeTruthy();
  });

  // test extra params bringHappiness

});

afterAll(async () => {
  browser.close();
});
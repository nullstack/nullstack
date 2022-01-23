beforeAll(async () => {
  page = await context.newPage();
  await page.goto('http://localhost:6969/stateful-component');
});

describe('StatefulComponent', () => {

  test('state is being reflected in the dom', async () => {
    const element = await page.$('[data-count="1"]');
    expect(element).toBeTruthy();
  });

  test('state is being reflected in the dom', async () => {
    const element = await page.$('[data-object-count="0"]');
    expect(element).toBeTruthy();
  });

  test('date instance variables are being hydrated as dates', async () => {
    const element = await page.$('[data-year="1992"]');
    expect(element).toBeTruthy();
  });

  test('state is being updated by events', async () => {
    await page.click('.increment-by-one');
    await page.waitForSelector('[data-count="2"]');
    const element = await page.$('[data-count="2"]');
    expect(element).toBeTruthy();
  });

  test('event attributes are merged into the function context', async () => {
    await page.click('.increment-by-two');
    await page.waitForSelector('[data-count="4"]');
    const element = await page.$('[data-count="4"]');
    expect(element).toBeTruthy();
  });

  test('objects can be passed to events', async () => {
    await page.click('.set-to-one');
    await page.waitForSelector('[data-count="1"]');
    const element = await page.$('[data-count="1"]');
    expect(element).toBeTruthy();
  });

  test('object events can declare a source', async () => {
    await page.click('.set-object-to-one');
    await page.waitForSelector('[data-object-count="1"]');
    const element = await page.$('[data-object-count="1"]');
    expect(element).toBeTruthy();
  });

  test('empty strings generate nodes', async () => {
    await page.click('[data-fill]');
    await page.waitForSelector('[data-empty="not"]');
    const text = await page.$eval('[data-empty="not"]', (e) => e.innerText);
    expect(text).toMatch('not');
  });

});
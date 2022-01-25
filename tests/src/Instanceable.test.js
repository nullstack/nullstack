beforeAll(async () => {
  await page.goto('http://localhost:6969/instanceable');
});

describe('Instanceable', () => {

  const testCycle = async (title, value) => {
    const selector = `[data-title="${title}"][data-hydrated]`;
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
    await page.click('button');
    await page.waitForSelector('[data-change-instanceable]');
    await testCycle('title', 'Nullstack!');
  });

  test("main key is 'application'", async () => {
    const p = await page.$('[data-application-key]');
    expect(p).toBeTruthy();
  });

  test('self key ignores the route suffix if a key is declared', async () => {
    await page.waitForSelector('[data-key="instanceable"]');
    const element = await page.$('[data-key="instanceable"]');
    expect(element).toBeTruthy();
  });

});
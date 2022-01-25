beforeAll(async () => {
  await page.goto('http://localhost:6969/full-stack-lifecycle');
});

describe('FullStackLifecycle', () => {

  test('prepare should run', async () => {
    await page.waitForSelector('[data-prepared]');
    const element = await page.$('[data-prepared]');
    expect(element).toBeTruthy();
  });

  test('initiate should run', async () => {
    await page.waitForSelector('[data-initiated]');
    const element = await page.$('[data-initiated]');
    expect(element).toBeTruthy();
  });

  test('hydrate should run', async () => {
    await page.waitForSelector('[data-hydrated]');
    const element = await page.$('[data-hydrated]');
    expect(element).toBeTruthy();
  });

  test('update should run', async () => {
    await page.waitForSelector('[data-updated]');
    const element = await page.$('[data-updated]');
    expect(element).toBeTruthy();
  });

  test('terminate should run', async () => {
    await page.click('a[href="/"]');
    await page.waitForFunction(() => location.search == '?terminated=true');
    const element = await page.$('.FullStackLifecycle');
    expect(element).toBeFalsy();
  });

});
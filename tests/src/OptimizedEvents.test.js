describe('OptimizedEvents', () => {

  beforeEach(async () => {
    await page.goto('http://localhost:6969/optimized-events');
  });

  test('events are triggered', async () => {
    await page.click('[data-increment-count]')
    await page.waitForSelector('[data-count="1"]');
    const element = await page.$('[data-count="1"]');
    expect(element).toBeTruthy();
  });

  test('events take the current attributes', async () => {
    await page.click('[data-increment-count]')
    await page.waitForSelector('[data-count="1"]');
    await page.click('[data-double-count]')
    await page.waitForSelector('[data-count="2"]');
    const element = await page.$('[data-count="2"]');
    expect(element).toBeTruthy();
  });

  test('events are triggered in elements that were added late to the dom', async () => {
    await page.click('[data-increment-count]')
    await page.waitForSelector('[data-after-render]');
    await page.click('[data-after-render]')
    await page.waitForSelector('[data-works-after-rendered]');
    const element = await page.$('[data-works-after-rendered]');
    expect(element).toBeTruthy();
  });

  test('inline events are triggered with current values', async () => {
    await page.click('[data-increment-count]')
    await page.waitForSelector('[data-count="1"]');
    await page.click('[data-set-count]')
    await page.waitForSelector('[data-count="11"]');
    const element = await page.$('[data-count="11"]');
    expect(element).toBeTruthy();
  });

  test('events can change references', async () => {
    await page.click('[data-even-odd]')
    await page.waitForSelector('[data-last-click="even"]');
    const element = await page.$('[data-last-click="even"]');
    expect(element).toBeTruthy();
  });

  test('events can change references', async () => {
    await page.click('[data-increment-count]')
    await page.waitForSelector('[data-count="1"]');
    await page.click('[data-even-odd]')
    await page.waitForSelector('[data-last-click="odd"]');
    const element = await page.$('[data-last-click="odd"]');
    expect(element).toBeTruthy();
  });

});
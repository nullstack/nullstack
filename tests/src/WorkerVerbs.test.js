beforeAll(async () => {
  page = await context.newPage();
  await page.goto('http://localhost:6969/worker-verbs');
});

describe('WorkerVerbs', () => {

  test('server functions with name starting with get followed by uppercase letter use GET', async () => {
    await page.waitForSelector('[data-get="GET"]');
    const element = await page.$('[data-get="GET"]');
    expect(element).toBeTruthy();
  });

  test('server functions with name starting with put followed by uppercase letter use PUT', async () => {
    await page.waitForSelector('[data-put="PUT"]');
    const element = await page.$('[data-put="PUT"]');
    expect(element).toBeTruthy();
  });

  test('server functions with name starting with patch followed by uppercase letter use PATCH', async () => {
    await page.waitForSelector('[data-patch="PATCH"]');
    const element = await page.$('[data-patch="PATCH"]');
    expect(element).toBeTruthy();
  });

  test('server functions with name starting with delete followed by uppercase letter use DELETE', async () => {
    await page.waitForSelector('[data-delete="DELETE"]');
    const element = await page.$('[data-delete="DELETE"]');
    expect(element).toBeTruthy();
  });

  test('server functions with name starting with post followed by uppercase letter use POST', async () => {
    await page.waitForSelector('[data-post="POST"]');
    const element = await page.$('[data-post="POST"]');
    expect(element).toBeTruthy();
  });

  test('server functions with name starting with get but not followed by uppercase letter use POST', async () => {
    await page.waitForSelector('[data-getter="POST"]');
    const element = await page.$('[data-getter="POST"]');
    expect(element).toBeTruthy();
  });

  test('server functions with name not starting with a verb use POST', async () => {
    await page.waitForSelector('[data-regular="POST"]');
    const element = await page.$('[data-regular="POST"]');
    expect(element).toBeTruthy();
  });

});
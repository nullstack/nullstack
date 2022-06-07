beforeAll(async () => {
  await page.goto('http://localhost:6969/context-page');
});

describe('ContextPage', () => {

  test('is part of the client context', async () => {
    const element = await page.$('[data-page]');
    expect(element).toBeTruthy();
  });

  test('the title key updates the document title', async () => {
    const text = await page.title()
    expect(text).toMatch('Nullstack Tests');
  });

  test('the title key updates the open graph title', async () => {
    const text = await page.$eval('head > meta[property="og:title"]', element => element.content);
    expect(text).toMatch('Nullstack Tests');
  });

  test('the title key updates the apple mobile web app title', async () => {
    const text = await page.$eval('head > meta[name="apple-mobile-web-app-title"]', element => element.content);
    expect(text).toMatch('Nullstack Tests');
  });

  test('the robots key updates the meta robots', async () => {
    const text = await page.$eval('head > meta[name="robots"]', element => element.content);
    expect(text).toMatch('index, follow');
  });

  test('the locale key updates the open graph locale', async () => {
    const text = await page.$eval('head > meta[property="og:locale"]', element => element.content);
    expect(text).toMatch('pt-BR');
  });

  test('the locale key updates the html lang', async () => {
    const text = await page.$eval('html', element => element.lang);
    expect(text).toMatch('pt-BR');
  });

  test('the image key updates the open graph image with a cdn url', async () => {
    const text = await page.$eval('head > meta[property="og:image"]', element => element.content);
    expect(text).toMatch('http://localhost:6969/image.jpg');
  });

  test('the description key updates the open graph description', async () => {
    const text = await page.$eval('head > meta[property="og:description"]', element => element.content);
    expect(text).toMatch('Nullstack tests page that tests the context page');
  });

  test('the description key updates the meta description', async () => {
    const text = await page.$eval('head > meta[name="description"]', element => element.content);
    expect(text).toMatch('Nullstack tests page that tests the context page');
  });

  test('the canonical tag is generated if the canonical key is omitted', async () => {
    const text = await page.$eval('head > link[rel="canonical"]', element => element.href);
    expect(text).toMatch('https://localhost:6969/context-page');
  });

  test('the schema key generates a json schema', async () => {
    const text = await page.$eval('head > script[type="application/ld+json"]', element => element.textContent);
    expect(text).toMatch('{"@type":"WebSite","@id":"#website","name":"Nullstack","url":"https://nullstack.app"}');
  });

  test('has a changes key', async () => {
    const element = await page.$('[data-changes="weekly"]');
    expect(element).toBeTruthy();
  });

  test('has a priority key', async () => {
    const element = await page.$('[data-priority="1"]');
    expect(element).toBeTruthy();
  });

  test('a custom event is triggered when the title changes', async () => {
    await page.click('button');
    await page.waitForSelector('[data-event-triggered]');
    const element = await page.$('[data-event-triggered]');
    expect(element).toBeTruthy();
  });

  test('the page reacts to a server function status', async () => {
    await page.click('[status="401"]');
    await page.waitForSelector('[data-page-status="401"]');
    const element = await page.$('[data-page-status="401"]');
    expect(element).toBeTruthy();
  });

});
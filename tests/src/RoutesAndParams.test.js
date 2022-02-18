describe('RoutesAndParams /routes-and-params', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params');
  });

  test('router has a base key', async () => {
    const element = await page.$('[data-base="http://localhost:6969"]');
    expect(element).toBeTruthy();
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
    await page.click('[data-params]');
    await page.waitForSelector('[data-date="1992-10-16T00:00:00.000Z"]');
    const element = await page.$('[data-date="1992-10-16T00:00:00.000Z"]');
    expect(element).toBeTruthy();
  });

});

describe('RoutesAndParams /routes-and-params/a', () => {

  beforeAll(async () => {
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

  test('params are available when coming from external', async () => {
    await page.goto('http://localhost:6969/');
    await page.click('[href="/routes-and-params/a"]');
    await page.waitForSelector('[data-hydrated-param]');
    const element = await page.$('[data-hydrated-param]');
    expect(element).toBeTruthy();
  });

});

describe('RoutesAndParams /routes-and-params/?boolean=true', () => {

  beforeAll(async () => {
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

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params?boolean=false');
  });

  test('params with value of false are converted to boolean', async () => {
    const element = await page.$('[data-boolean]');
    expect(element).toBeFalsy();
  });

});

describe('RoutesAndParams /routes-and-params/c', () => {

  beforeAll(async () => {
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

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/c/a');
  });

  test('wildcards can be prefixed', async () => {
    const element = await page.$('[data-wildcard]');
    expect(element).toBeTruthy();
  });

});

describe('RoutesAndParams /routes-and-params/d?boolean=true#hash ssr', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/d?boolean=true#hash');
  });

  test('hash is not part of the router url', async () => {
    const element = await page.$('[data-url="/routes-and-params/d?boolean=true"]');
    expect(element).toBeTruthy();
  });

  test('hash is not part of the router path', async () => {
    const element = await page.$('[data-path="/routes-and-params/d"]');
    expect(element).toBeTruthy();
  });

});

describe('RoutesAndParams /routes-and-params/d?boolean=true#hash spa', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params/d?boolean=true#hash');
    await page.click('[href="/routes-and-params/no-hash#hash"]');
    await page.waitForSelector('[data-url="/routes-and-params/no-hash"]');
  });

  test('hash is not part of the router url', async () => {
    const element = await page.$('[data-url="/routes-and-params/no-hash"]');
    expect(element).toBeTruthy();
  });

  test('hash is not part of the router path', async () => {
    const element = await page.$('[data-path="/routes-and-params/no-hash"]');
    expect(element).toBeTruthy();
  });

});

describe('RoutesAndParams /routes-and-params', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params');
  });

  test('a with absolute hrefs cause a hard redirect', async () => {
    await page.click('[href="https://nullstack.app"]');
    await page.waitForSelector('[href="/contributors"]');
    const url = await page.url();
    expect(url).toMatch('https://nullstack.app');
  });

});

describe('RoutesAndParams /routes-and-params', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params');
  });

  test('a with absolute hrefs cause a hard redirect', async () => {
    await page.click('[data-absolute]');
    await page.waitForSelector('[href="/contributors"]');
    const url = await page.url();
    expect(url).toMatch('https://nullstack.app');
  });

});

describe('RoutesAndParams /routes-and-params?previous=true', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/routes-and-params?previous=true');
  });

  test('router previous key starts null', async () => {
    const element = await page.$('[data-previous="null"]');
    expect(element).toBeTruthy();
  });

  test('router previous is assigned with the old router url when route updates', async () => {
    await page.click('[href="/routes-and-params?framework=nullstack"]');
    await page.waitForSelector('[data-previous="/routes-and-params?previous=true"]');
    const element = await page.$('[data-previous="/routes-and-params?previous=true"]');
    expect(element).toBeTruthy();
  });

});

describe('RoutesAndParams /routes-and-params/inner-html', () => {

  const htmlRoute = 'routes-and-params/inner-html?hideLink=';

  async function showLink(urlEnd = '') {
    await page.goto(`http://localhost:6969/${htmlRoute}${urlEnd}`);
    await page.waitForSelector('[data-show-link="click"]');
    await page.click('[data-show-link="click"]');
    await page.waitForSelector('[data-show-link="clicked"]');
    await page.waitForSelector('[data-shown-link]');
  }

  async function redirectAndKeepState(urlEnd = '', doubleLink = false) {
    await showLink(urlEnd);
    let selector = `href="/${htmlRoute}${urlEnd}"`;
    if (doubleLink) {
      await page.click('[data-double-link]');
      selector = 'data-link2';
    }
    await page.waitForSelector(`[${selector}]`);
    await page.click(`[${selector}]`);
    return page.$('[data-show-link="clicked"]');
  }

  test('html route injected from start do not refresh', async () => {
    const element = await redirectAndKeepState();
    expect(element).toBeTruthy();
  });

  test('html route injected after first render do not refresh', async () => {
    const element = await redirectAndKeepState('true');
    expect(element).toBeTruthy();
  });

  test('html route added beside existent do not refresh', async () => {
    const element2 = await redirectAndKeepState('', true);
    expect(element2).toBeTruthy();
  });

});
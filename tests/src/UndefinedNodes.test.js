const browser = context;

beforeAll(async () => {
  page = await browser.newPage();
});

describe('UndefinedNodes WithoutReturn', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
  });

  test('renderable functions without return should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?withoutReturn=true');
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes WithoutUndefinedReturn', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
  });

  test('renderable functions with undefined return should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?withoutUndefinedReturn=true');
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes WithoutRetunr', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
  });

  test('tagging a renderable function that does not exist should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?withoutRetunr=true');
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes ForgotToImport', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
  });

  test('tagging a renderable function that was not imported should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?forgotToImport=true');
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes undeclaredVariable', () => {

  let page;

  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:6969/undefined-nodes?undeclaredVariable=true');
  });

  test('undefined variables should render a comment node instead of raising an error', async () => {
    const truth = await page.$eval('[data-undeclared-variable]', (e) => e.childNodes[0] instanceof Comment);
    expect(truth).toBeTruthy();
  });

})
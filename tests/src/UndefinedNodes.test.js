describe('UndefinedNodes WithoutReturn', () => {

  test('renderable functions without return should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?withoutReturn=true');
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes WithoutUndefinedReturn', () => {

  test('renderable functions with undefined return should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?withoutUndefinedReturn=true', { waitUntil: "networkidle0" });
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes WithoutRetunr', () => {

  test('tagging a renderable function that does not exist should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?withoutRetunr=true', { waitUntil: "networkidle0" });
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes ForgotToImport', () => {

  test('tagging a renderable function that was not imported should raise an error', async () => {
    const response = await page.goto('http://localhost:6969/undefined-nodes?forgotToImport=true', { waitUntil: "networkidle0" });
    expect(response.status()).toEqual(500)
  });

})

describe('UndefinedNodes undeclaredVariable', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:6969/undefined-nodes?undeclaredVariable=true');
  });

  test('undefined variables should render a comment node instead of raising an error', async () => {
    const truth = await page.$eval('[data-undeclared-variable]', (e) => e.childNodes[0] instanceof Comment);
    expect(truth).toBeTruthy();
  });

})
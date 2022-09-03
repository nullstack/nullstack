describe('ServerFunctions', () => {

  beforeEach(async () => {
    await page.goto('http://localhost:6969/isomorphic-import');
    await page.waitForSelector('[data-hydrated]');
  });

  test('isomorphic imports used in the client stay in the client bundle', async () => {
    const element = await page.$('[data-client-only]');
    expect(element).toBeTruthy();
  });

  test('isomorphic aliased imports used in the client stay in the client bundle', async () => {
    const element = await page.$('[data-client-only-alias]');
    expect(element).toBeTruthy();
  });

  test('isomorphic imports used in the server only are removed from the client bundle', async () => {
    const element = await page.$('[data-server-only]');
    expect(element).toBeTruthy();
  });

  test('isomorphic aliased imports used in the server only are removed from the client bundle', async () => {
    const element = await page.$('[data-server-only-alias]');
    expect(element).toBeTruthy();
  });

  test('isomorphic namespaced imports used in the server only are removed from the client bundle', async () => {
    const element = await page.$('[data-namespaced-server-only]');
    expect(element).toBeTruthy();
  });



});
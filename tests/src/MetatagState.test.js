let hasConsoleError = false;
let originalConsole = console.error;

beforeAll(async () => {
  console.error = jest.fn(() => hasConsoleError = true);
  await page.goto('http://localhost:6969/metatag-state');
});

describe('MetatagState', () => {

  test('state stored at metatag can be retrieved without errors', async () => {
    expect(hasConsoleError).toBeFalsy();
  });

});

afterAll(async () => {
  console.error = originalConsole;
});
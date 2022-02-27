describe('ErrorOnChildNode dom', () => {

  let error;

  beforeAll(async () => {
    jest.spyOn(console, 'error').mockImplementation((message) => error = message);
    await page.goto('http://localhost:6969/error-on-child-node?dom=true');
  });

  test('should log that the dom is invalid', async () => {
    page.on("console", async () => {
      expect(error).toMatch('THEAD expected tag TH to be child at index 2 but instead found undefined. This error usually happens because of an invalid HTML hierarchy or changes in comparisons after serialization.');
    })
  });

})

describe('ErrorOnChildNode serialization', () => {

  let error;

  beforeAll(async () => {
    jest.spyOn(console, 'error').mockImplementation((message) => error = message);
    await page.goto('http://localhost:6969/error-on-child-node?serialization=true');
  });

  test('Should log that the serialization missmatches the server dom', async () => {
    page.on("console", async () => {
      expect(error).toMatch('DIV expected tag DIV to be child at index 0 but instead found undefined. This error usually happens because of an invalid HTML hierarchy or changes in comparisons after serialization.');
    })
  });

})
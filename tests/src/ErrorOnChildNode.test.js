describe('ErrorOnChildNode dom ssr', () => {

  test('should log that the dom is invalid', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:6969/error-on-child-node?dom=true');
    page.on("console", async (message) => {
      expect(message.text()).toMatch('THEAD expected tag TH to be child at index 2 but instead found undefined. This error usually happens because of an invalid HTML hierarchy or changes in comparisons after serialization.');
    })
  });


  test('Should log that the serialization missmatches the server dom', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:6969/error-on-child-node?serialization=true');
    page.on("console", async (message) => {
      expect(message.text()).toMatch('DIV expected tag DIV to be child at index 0 but instead found undefined. This error usually happens because of an invalid HTML hierarchy or changes in comparisons after serialization.');
    })
  });

  test('hydration errors related to dom should not happen in spa mode', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:6969/');
    await page.click('[href="/error-on-child-node?dom=true"]');
    await page.waitForSelector('[data-dom-error]');
    await page.click('[data-dom-error]');
    await page.waitForSelector('[data-value="Changed Value"]');
    const element = await page.$('[data-value="Changed Value"]');
    expect(element).toBeTruthy();
  });

  test('hydration errors related to dom should not happen in spa mode', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:6969/');
    await page.click('[href="/error-on-child-node?serialization=true"]');
    await page.waitForSelector('[data-dom-error]');
    await page.click('[data-dom-error]');
    await page.waitForSelector('[data-value="Changed Value"]');
    const element = await page.$('[data-value="Changed Value"]');
    expect(element).toBeTruthy();
  });

})
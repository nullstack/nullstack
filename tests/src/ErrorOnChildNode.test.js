const browser = context;

beforeAll(async () => {
  page = await browser.newPage();

  await page.goto('http://localhost:6969/error-on-child-node');
});

describe('Error when ChildNode is undefined', () => {

  test('Should be able to click on button', async () => {
    page.on("console", async (msg) => {
      expect(msg.text()).toMatch('Virtual DOM does not match the DOM. Expected tag thead but instead found undefined. This error usually happens because of an invalid HTML hierarchy like nested forms or tables without tr.');
      await page.click('[id=buttonTest]');
      await page.waitForSelector('[id=text]');
    })
  });

})